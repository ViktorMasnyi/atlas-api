import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplication } from '../entities/loan-application.entity';
import { RuleEngineService } from '../rules/rule-engine.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly loanRepo: Repository<LoanApplication>,
    private readonly ruleEngine: RuleEngineService,
  ) {}

  async createAndEvaluate(payload: {
    applicantName: string;
    creditScore: number;
    monthlyIncome: number;
    requestedAmount: number;
    loanTermMonths: number;
  }): Promise<LoanApplication> {
    const result = await this.ruleEngine.evaluate(payload);
    const entity = this.loanRepo.create({
      ...payload,
      eligible: result.eligible,
      reason: result.reason,
      evaluatedAt: new Date(),
      ruleVersionUsed: result.version,
    });
    return await this.loanRepo.save(entity);
  }

  async findOne(id: string): Promise<LoanApplication | null> {
    return await this.loanRepo.findOne({ where: { id } });
  }
}
