import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BillingPlan from './entities/billing_plan.entity';
import { BillingPlanRepository } from './repositories/billing_plan.repository';
import { BillingController } from './billing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillingPlan])],
  providers: [BillingService, BillingPlanRepository],
  controllers: [BillingController],
})
export class BillingModule {}
