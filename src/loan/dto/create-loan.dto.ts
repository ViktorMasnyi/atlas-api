import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLoanApplicationDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: 'applicantName must be a string' })
  @IsNotEmpty({ message: 'applicantName should not be empty' })
  applicantName: string;

  @ApiProperty({ example: 720, minimum: 300, maximum: 850 })
  @Type(() => Number)
  @IsNumber({}, { message: 'creditScore must be a number' })
  @Min(300, { message: 'creditScore must be a number between 300 and 850' })
  @Max(850, { message: 'creditScore must be a number between 300 and 850' })
  creditScore: number;

  @ApiProperty({ example: 6500, minimum: 0 })
  @Type(() => Number)
  @IsNumber({}, { message: 'monthlyIncome must be a number' })
  @Min(0, { message: 'monthlyIncome must be non-negative' })
  monthlyIncome: number;

  @ApiProperty({ example: 150000, minimum: 1000 })
  @Type(() => Number)
  @IsNumber({}, { message: 'requestedAmount must be a number' })
  @Min(1000, { message: 'requestedAmount must be at least 1000' })
  requestedAmount: number;

  @ApiProperty({ example: 24, minimum: 1, maximum: 360 })
  @Type(() => Number)
  @IsNumber({}, { message: 'loanTermMonths must be a number' })
  @Min(1, { message: 'loanTermMonths must be between 1 and 360' })
  @Max(360, { message: 'loanTermMonths must be between 1 and 360' })
  loanTermMonths: number;
}
