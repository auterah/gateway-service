import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BillingPlan from './entities/billing_plan.entity';
import { BillingPlanRepository } from './repositories/billing_plan.repository';
import { BillingController } from './billing.controller';
import { BillingRepository } from './repositories/billing.repository';
import Billing from './entities/billing.entity';
import { BillingCron } from './billing.cron';
import { BillingThresholdRepository } from './repositories/billing_threshold.repository';
import BillingThreshold from './entities/billing_threshold.entity';
import { BillingThresholdService } from './billing_threshold.service';

@Module({
  imports: [TypeOrmModule.forFeature([BillingPlan, Billing, BillingThreshold])],
  providers: [
    BillingService,
    BillingPlanRepository,
    BillingRepository,
    BillingCron,
    BillingThresholdService,
    BillingThresholdRepository,
  ],
  controllers: [BillingController],
})
export class BillingModule {}
