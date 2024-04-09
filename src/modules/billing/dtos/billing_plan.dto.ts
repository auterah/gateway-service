import { IsNumber, IsString } from 'class-validator';
import BillingPlan from '../entities/billing_plan.entity';

export class BillingPlanDto extends BillingPlan {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  cycles: number;
}
