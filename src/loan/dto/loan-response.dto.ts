import { ApiProperty } from '@nestjs/swagger';

export class LoanResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b9b1a4f5-0d3a-4bd8-9e6c-6f612c0d7a3e',
  })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  applicantName: string;

  @ApiProperty({ example: true })
  eligible: boolean;

  @ApiProperty({ example: 'Passed all checks' })
  reason: string;

  @ApiProperty({ example: 720 })
  creditScore: number;

  @ApiProperty({ example: 6500 })
  monthlyIncome: number;

  @ApiProperty({ example: 150000 })
  requestedAmount: number;

  @ApiProperty({ example: 24 })
  loanTermMonths: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  evaluatedAt: Date;

  @ApiProperty({ example: 'v1.0' })
  ruleVersion: string;
}
