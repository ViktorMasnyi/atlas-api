import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RuleEventParams {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  eligible: boolean;

  @ApiProperty({ example: 'Passed all checks' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

class RuleEvent {
  @ApiProperty({ example: 'eligible' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: () => RuleEventParams })
  @Type(() => RuleEventParams)
  @ValidateNested()
  params: RuleEventParams;
}

class Condition {
  @ApiProperty({ example: 'creditScore' })
  @IsString()
  @IsNotEmpty()
  fact: string;

  @ApiProperty({ example: 'greaterThanInclusive' })
  @IsString()
  @IsNotEmpty()
  operator: string;

  @ApiProperty({ example: 700 })
  @IsNotEmpty()
  value: any;
}

class RuleConditions {
  @ApiProperty({ type: () => [Condition], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Condition)
  all?: Condition[];

  @ApiProperty({ type: () => [Condition], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Condition)
  any?: Condition[];
}

class Rule {
  @ApiProperty({ type: () => RuleConditions })
  @Type(() => RuleConditions)
  @ValidateNested()
  conditions: RuleConditions;

  @ApiProperty({ type: () => RuleEvent })
  @Type(() => RuleEvent)
  @ValidateNested()
  event: RuleEvent;
}

export class UpdateRulesDto {
  @ApiProperty({ type: () => [Rule] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Rule)
  rules: Rule[];

  @ApiProperty({ example: 'v1.1' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example: 'Updated minimum credit score requirements',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
