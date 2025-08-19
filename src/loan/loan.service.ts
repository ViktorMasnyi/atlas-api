import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplication } from '../entities/loan-application.entity';
import { RuleEngineService } from '../rules/rule-engine.service';
import { CrimeAnalysisService } from '../crime-analysis/crime-analysis.service';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(
    @InjectRepository(LoanApplication)
    private readonly loanRepo: Repository<LoanApplication>,
    private readonly ruleEngine: RuleEngineService,
    private readonly crimeAnalysisService: CrimeAnalysisService,
    private readonly configService: ConfigService,
  ) {}

  async createAndEvaluate(payload: {
    applicantName: string;
    creditScore: number;
    monthlyIncome: number;
    requestedAmount: number;
    loanTermMonths: number;
    zipCode: string;
  }): Promise<LoanApplication> {
    this.logger.log(
      `Processing loan application for ${payload.applicantName} in ZIP ${payload.zipCode}`,
    );

    try {
      // Analyze crime rate for the ZIP code
      const crimeAnalysis = await this.crimeAnalysisService.analyzeCrimeRate(
        payload.zipCode,
      );

      this.logger.log(
        `Crime analysis result: score = ${crimeAnalysis.crimeScore}`,
      );

      // Prepare enhanced payload with crime data for rule engine
      const enhancedPayload = {
        ...payload,
        crimeRate: crimeAnalysis.crimeScore,
        crimeRateThreshold: 0.8, // Threshold for automatic decline
        crimeRateWeight: this.configService.get<number>('crimeAnalysis.crimeRateWeight'), // Configurable weight
      };

      // Evaluate rules with crime data
      const result = await this.ruleEngine.evaluate(enhancedPayload);

      // Create and save the loan application
      const entity = this.loanRepo.create({
        ...payload,
        crimeScore: crimeAnalysis.crimeScore,
        eligible: result.eligible,
        reason: result.reason,
        evaluatedAt: new Date(),
        ruleVersionUsed: result.version,
      });

      const savedEntity = await this.loanRepo.save(entity);
      this.logger.log(
        `Loan application processed successfully: ${savedEntity.id}`,
      );

      return savedEntity;
    } catch (error) {
      this.logger.error(`Failed to process loan application:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<LoanApplication | null> {
    return await this.loanRepo.findOne({ where: { id } });
  }
}
