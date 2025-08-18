import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessRule } from '../entities/business-rule.entity';
import { RuleHistory } from '../entities/rule-history.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RuleEngineService } from '../rules/rule-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessRule, RuleHistory])],
  controllers: [AdminController],
  providers: [AdminService, RuleEngineService],
})
export class AdminModule {}
