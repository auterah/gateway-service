import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import BillingThreshold from '../entities/billing_threshold.entity';
import { Type } from 'class-transformer';

export class BillingThresholdDto extends BillingThreshold {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  threshold: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsString()
  @IsOptional()
  comment: string;
}

export class ManyBillingThresholdDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => BillingThresholdDto)
  @ArrayNotEmpty()
  thresholds: BillingThresholdDto[];
}
