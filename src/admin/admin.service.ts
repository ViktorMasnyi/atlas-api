import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessRule } from '../entities/business-rule.entity';
import { RuleHistory } from '../entities/rule-history.entity';
import { UpdateRulesDto } from './dto/update-rules.dto';
import { RuleEngineService } from '../rules/rule-engine.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(BusinessRule)
    private readonly ruleRepo: Repository<BusinessRule>,
    @InjectRepository(RuleHistory)
    private readonly historyRepo: Repository<RuleHistory>,
    private readonly ruleEngine: RuleEngineService,
    private readonly configService: ConfigService,
  ) {}

  async updateRules(dto: UpdateRulesDto) {
    try {
      this.ruleEngine.validateRulesStructure(dto.rules);
    } catch (e: any) {
      throw new BadRequestException({
        errorCode: 'RULE_VALIDATION_ERROR',
        errorMessage: e.message,
      });
    }

    const existingVersion = await this.ruleRepo.findOne({
      where: { version: dto.version },
    });
    if (existingVersion) {
      throw new BadRequestException({
        errorCode: 'RULE_VERSION_CONFLICT',
        errorMessage: 'Version must be unique',
      });
    }

    await this.ruleRepo.update({ isActive: true }, { isActive: false });

    const newRule = this.ruleRepo.create({
      version: dto.version,
      rules: dto.rules,
      isActive: true,
    });
    await this.ruleRepo.save(newRule);

    const label = this.configService.get<string>('adminApiKeyLabel') || 'admin';
    const previous = await this.historyRepo.find({
      order: { changedAt: 'DESC' },
      take: 1,
    });
    const oldVersion = previous[0]?.newVersion ?? null;
    await this.historyRepo.save(
      this.historyRepo.create({
        oldVersion,
        newVersion: dto.version,
        changedBy: label,
        changeDescription: dto.description ?? null,
      }),
    );

    await this.ruleEngine.loadActiveRules();

    return { version: newRule.version, isActive: newRule.isActive };
  }

  async getActiveRules() {
    const active = await this.ruleRepo.findOne({ where: { isActive: true } });
    if (!active) return { rules: [], version: null };
    return { rules: active.rules, version: active.version };
  }

  async getRuleHistory() {
    const history = await this.historyRepo.find({
      order: { changedAt: 'DESC' },
    });
    return history;
  }
}
