import { Injectable } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BillingCron extends BillingService {
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  handleBillingCron() {
    this.processBillings();
  }
}
