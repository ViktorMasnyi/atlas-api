import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanApplicationDto } from './dto/create-loan.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoanResponseDto } from './dto/loan-response.dto';

@ApiTags('loan')
@ApiHeader({ name: 'x-api-key', required: true })
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Submit and evaluate loan application' })
  @ApiOkResponse({ type: LoanResponseDto })
  @UseGuards(ApiKeyGuard)
  async create(@Body() body: CreateLoanApplicationDto) {
    const dto = plainToInstance(CreateLoanApplicationDto, body);
    await validateOrReject(dto);
    const loan = await this.loanService.createAndEvaluate(dto);
    return {
      id: loan.id,
      applicantName: loan.applicantName,
      eligible: loan.eligible,
      reason: loan.reason,
      creditScore: loan.creditScore,
      monthlyIncome: loan.monthlyIncome,
      requestedAmount: loan.requestedAmount,
      loanTermMonths: loan.loanTermMonths,
      evaluatedAt: loan.evaluatedAt,
      ruleVersion: loan.ruleVersionUsed,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve stored loan application with evaluation results',
  })
  @ApiOkResponse({ type: LoanResponseDto })
  @UseGuards(ApiKeyGuard)
  async findOne(@Param('id') id: string) {
    const loan = await this.loanService.findOne(id);
    if (!loan) {
      return null;
    }
    return {
      id: loan.id,
      applicantName: loan.applicantName,
      eligible: loan.eligible,
      reason: loan.reason,
      creditScore: loan.creditScore,
      monthlyIncome: loan.monthlyIncome,
      requestedAmount: loan.requestedAmount,
      loanTermMonths: loan.loanTermMonths,
      evaluatedAt: loan.evaluatedAt,
      ruleVersion: loan.ruleVersionUsed,
    };
  }
}
