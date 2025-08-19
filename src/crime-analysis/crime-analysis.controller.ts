import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CrimeAnalysisService } from './crime-analysis.service';
import { ConfigService } from '@nestjs/config';

@Controller('crime-analysis')
@UseGuards(ApiKeyGuard)
export class CrimeAnalysisController {
  constructor(
    private readonly crimeAnalysisService: CrimeAnalysisService,
    private readonly configService: ConfigService,
  ) {}

  @Get('config')
  async getConfig() {
    return {
      zylaApiKey: this.configService.get('crimeAnalysis.zylaApiKey')
        ? 'SET'
        : 'NOT SET',
      openaiApiKey: this.configService.get('crimeAnalysis.openaiApiKey')
        ? 'SET'
        : 'NOT SET',
      crimeRateWeight: this.configService.get('crimeAnalysis.crimeRateWeight'),
    };
  }

  @Get('test/:zipCode')
  async testCrimeAnalysis(@Param('zipCode') zipCode: string) {
    try {
      const result = await this.crimeAnalysisService.analyzeCrimeRate(zipCode);
      return {
        success: true,
        zipCode,
        crimeScore: result.crimeScore,
        rawData: result.rawData,
      };
    } catch (error) {
      return {
        success: false,
        zipCode,
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
