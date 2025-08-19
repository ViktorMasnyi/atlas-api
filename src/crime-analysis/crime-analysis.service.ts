import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrimeData } from '../entities/crime-data.entity';
import { DynamicTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export interface CrimeAnalysisResult {
  crimeScore: number;
  rawData: any;
}

@Injectable()
export class CrimeAnalysisService {
  private readonly logger = new Logger(CrimeAnalysisService.name);
  private agentExecutor: AgentExecutor | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(CrimeData)
    private readonly crimeDataRepository: Repository<CrimeData>,
  ) {}

  private async initializeAgent(): Promise<void> {
    if (this.agentExecutor) return;

    const openAIApiKey = this.configService.get<string>(
      'crimeAnalysis.openaiApiKey',
    );
    if (!openAIApiKey) {
      this.logger.error('OPENAI_API_KEY environment variable is not set');
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      openAIApiKey,
    });

    // Create a tool for fetching crime data
    const crimeDataTool = new DynamicTool({
      name: 'fetch_crime_data',
      description:
        'Fetches crime data for a given ZIP code from the external API',
      func: async (zipCode: string) => {
        return await this.fetchCrimeDataFromAPI(zipCode);
      },
    });

    const tools = [crimeDataTool];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are an AI agent that analyzes crime data for loan applications. 
      
Your task is to:
1. Fetch crime data for a given ZIP code using the fetch_crime_data tool
2. Analyze the crime data and determine a crime score from 0 to 1
   - 0 = lowest crime rate (very safe area)
   - 1 = highest crime rate (very dangerous area)
3. Consider factors like:
   - Overall crime grade (A-F scale),
   - A being the safest, F being the most dangerous
   - Violent crime rates
   - Property crime rates
   - Crime frequency and statistics
   - Risk percentages mentioned in the data
4. Do not provide any additional information or explanations in your response.
5. MANDATORY: Return ONLY a number between 0 and 1 representing the crime score.
6. you can answer only with a number between 0 and 1, no other text`,
      ],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    const agent = await createToolCallingAgent({
      llm: model,
      tools,
      prompt,
    });

    this.agentExecutor = new AgentExecutor({
      agent,
      tools,
    });
  }

  private async fetchCrimeDataFromAPI(zipCode: string): Promise<string> {
    const apiKey = this.configService.get<string>('crimeAnalysis.zylaApiKey');
    if (!apiKey) {
      this.logger.error('ZYLA_API_KEY environment variable is not set');
      throw new Error('ZYLA_API_KEY environment variable is required');
    }
    // 'https://zylalabs.com/api/4190/usa++crime+grades+by+zip+code+api/5074/get+data+by+zip';

    const url = `http://crime-mock-api:3001?zip=${zipCode}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log('====crimeRawData', data.Overall);

      return JSON.stringify(data);
    } catch (error) {
      this.logger.error(
        `Failed to fetch crime data for ZIP ${zipCode}:`,
        error,
      );
      throw new Error(`Unable to get crime rate: ${error.message}`);
    }
  }

  async analyzeCrimeRate(zipCode: string): Promise<CrimeAnalysisResult> {
    this.logger.log(`Analyzing crime rate for ZIP code: ${zipCode}`);

    try {
      await this.initializeAgent();

      if (!this.agentExecutor) {
        throw new Error('Agent executor not initialized');
      }

      const result = await this.agentExecutor.invoke({
        input: `Analyze the crime rate for ZIP code ${zipCode}. Fetch the data and provide a crime score from 0 to 1.`,
      });

      // Extract the crime score from the agent's response
      const crimeScoreText = result.output;
      const crimeScore = this.parseCrimeScore(crimeScoreText);

      // Fetch raw data for storage
      const rawData = await this.fetchCrimeDataFromAPI(zipCode);
      const parsedRawData = JSON.parse(rawData);

      // Store the result in database
      await this.storeCrimeData(zipCode, crimeScore, parsedRawData);

      this.logger.log(
        `Crime analysis completed for ZIP ${zipCode}: score = ${crimeScore}`,
      );

      return {
        crimeScore,
        rawData: parsedRawData,
        // rawData: [],
      };
    } catch (error) {
      this.logger.error(`Crime analysis failed for ZIP ${zipCode}:`, error);
      this.logger.error(`Error details: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      throw new Error(`Unable to get crime rate: ${error.message}`);
    }
  }

  private parseCrimeScore(response: string): number {
    // Extract number from response, handle various formats
    this.logger.log(`Parsing crime score from response: ${response}`);
    const match = response.match(/([01](?:\.\d+)?)/);
    if (!match) {
      throw new Error('Could not parse crime score from agent response');
    }

    const score = parseFloat(match[1]);
    if (isNaN(score) || score < 0 || score > 1) {
      throw new Error(
        `Invalid crime score: ${score}. Must be between 0 and 1.`,
      );
    }

    return score;
  }

  private async storeCrimeData(
    zipCode: string,
    crimeScore: number,
    rawData: any,
  ): Promise<void> {
    try {
      const existingData = await this.crimeDataRepository.findOne({
        where: { zipCode },
      });

      if (existingData) {
        existingData.crimeScore = crimeScore;
        existingData.rawData = rawData;
        existingData.lastUpdated = new Date();
        await this.crimeDataRepository.save(existingData);
      } else {
        const crimeData = this.crimeDataRepository.create({
          zipCode,
          crimeScore,
          rawData,
          lastUpdated: new Date(),
        });
        await this.crimeDataRepository.save(crimeData);
      }
    } catch (error) {
      this.logger.error(
        `Failed to store crime data for ZIP ${zipCode}:`,
        error,
      );
      // Don't throw error here as the main functionality should still work
    }
  }

  async getCachedCrimeData(zipCode: string): Promise<CrimeData | null> {
    return await this.crimeDataRepository.findOne({
      where: { zipCode },
    });
  }
}
