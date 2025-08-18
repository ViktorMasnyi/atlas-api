import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { RuleEngineService } from '../rules/rule-engine.service';
import { BusinessRule } from '../entities/business-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplication, BusinessRule])],
  controllers: [LoanController],
  providers: [LoanService, RuleEngineService],
  exports: [LoanService],
})
export class LoanModule {}
