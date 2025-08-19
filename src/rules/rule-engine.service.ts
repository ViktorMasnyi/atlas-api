import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessRule } from '../entities/business-rule.entity';
import { Engine } from 'json-rules-engine';

export interface RuleEvaluationResult {
  eligible: boolean;
  reason: string;
  version: string;
}

@Injectable()
export class RuleEngineService implements OnModuleInit {
  private readonly logger = new Logger(RuleEngineService.name);
  private engine: Engine | null = null;
  private activeVersion: string | null = null;

  constructor(
    @InjectRepository(BusinessRule)
    private readonly businessRuleRepository: Repository<BusinessRule>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.loadActiveRules();
  }

  async loadActiveRules(): Promise<void> {
    const current = await this.businessRuleRepository.findOne({
      where: { isActive: true },
    });
    if (!current) {
      this.engine = null;
      this.activeVersion = null;
      return;
    }

    this.engine = new Engine(current.rules);
    this.activeVersion = current.version;
    this.logger.log(`Loaded rule version ${current.version}`);
  }

  getActiveVersion(): string | null {
    return this.activeVersion;
  }

  async refreshRules(): Promise<void> {
    await this.loadActiveRules();
  }

  async checkAndRefreshRules(): Promise<void> {
    const current = await this.businessRuleRepository.findOne({
      where: { isActive: true },
    });

    // If no active rules in DB or version changed, refresh
    if (!current || current.version !== this.activeVersion) {
      await this.loadActiveRules();
    }
  }

  validateRulesStructure(rules: any[]): void {
    if (!Array.isArray(rules) || rules.length === 0) {
      throw new Error('Rules must be a non-empty array');
    }
    const hasEligibleEvent = rules.some(
      (r) => r?.event?.params && typeof r.event.params.eligible === 'boolean',
    );
    if (!hasEligibleEvent) {
      throw new Error(
        'At least one rule must include an event with boolean eligible',
      );
    }
    // Attempt to instantiate to validate structure
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _engine = new Engine(rules);
  }

  async evaluate(app: {
    applicantName: string;
    creditScore: number;
    monthlyIncome: number;
    requestedAmount: number;
    loanTermMonths: number;
    crimeRate: number;
    crimeRateThreshold: number;
    crimeRateWeight: number;
  }): Promise<RuleEvaluationResult> {
    // Check and refresh rules if needed before evaluation
    await this.checkAndRefreshRules();

    if (!this.engine || !this.activeVersion) {
      throw new Error('No active rule set loaded');
    }

    const monthlyPaymentBase = app.requestedAmount / app.loanTermMonths;
    const monthlyIncomeRatio =
      monthlyPaymentBase === 0 ? 0 : app.monthlyIncome / monthlyPaymentBase;

    const facts = {
      applicantName: app.applicantName,
      creditScore: app.creditScore,
      monthlyIncome: app.monthlyIncome,
      requestedAmount: app.requestedAmount,
      loanTermMonths: app.loanTermMonths,
      monthlyIncomeRatio,
      crimeRate: app.crimeRate,
    };

    let eligible = false;
    let reason = 'Not eligible';

    await this.engine
      .run(facts)
      .then(({ events }) => {
        for (const event of events) {
          if (event?.params && typeof event.params.eligible === 'boolean') {
            eligible = event.params.eligible;
            reason = event.params.reason || reason;
          }
        }
      })
      .catch((err) => {
        throw err;
      });

    return { eligible, reason, version: this.activeVersion };
  }
}
