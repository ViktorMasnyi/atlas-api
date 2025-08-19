import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrimeAnalysisService } from './crime-analysis.service';
import { CrimeAnalysisController } from './crime-analysis.controller';
import { CrimeData } from '../entities/crime-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrimeData])],
  controllers: [CrimeAnalysisController],
  providers: [CrimeAnalysisService],
  exports: [CrimeAnalysisService],
})
export class CrimeAnalysisModule {}
