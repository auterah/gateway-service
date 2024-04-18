import { Injectable } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BillingCron extends BillingService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleBillingCron() {
    this.processBillings();
  }
}
