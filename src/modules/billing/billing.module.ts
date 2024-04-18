import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BillingPlan from './entities/billing_plan.entity';
import { BillingPlanRepository } from './repositories/billing_plan.repository';
import { BillingController } from './billing.controller';
import { BillingRepository } from './repositories/billing.repository';
import Billing from './entities/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillingPlan, Billing])],
  providers: [BillingService, BillingPlanRepository, BillingRepository],
  controllers: [BillingController],
})
export class BillingModule {}
