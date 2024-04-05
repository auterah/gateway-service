import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BillingDto {
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsOptional()
  appId: string;
}
