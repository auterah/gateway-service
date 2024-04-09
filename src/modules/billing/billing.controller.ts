import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin_guard';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { BillingService } from './billing.service';
import { BillingPlanDto } from './dtos/billing_plan.dto';

@Controller('billings')
@UseGuards(AdminGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('plans')
  addBillingPlan(@Body() payload: BillingPlanDto) {
    return this.billingService.addPlan(payload);
  }

  @Get('plans')
  getAllBillingPlans(@Query() queries: FindDataRequestDto) {
    return this.billingService.findAllBillingPlansRecords(queries);
  }

  @Get('plans/name/:name')
  getOneBillingPlanByName(@Param('name') name: string) {
    return this.billingService.findOneBillingPlanByName(name);
  }

  @Get('plans/type/:type')
  getOneBillingPlanByType(@Param('type') type: string) {
    return this.billingService.findOneBillingPlanByType(type);
  }
}
