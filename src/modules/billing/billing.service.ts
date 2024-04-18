import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingPlanRepository } from './repositories/billing_plan.repository';
import { BillingPlanDto } from './dtos/billing_plan.dto';
import BillingPlan from './entities/billing_plan.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { FindOneOptions } from 'typeorm';
import { BillingRepository } from './repositories/billing.repository';
import { BillingUtils } from './utils/billing_utils';
import Billing from './entities/billing.entity';

@Injectable()
export class BillingService {
  private logger = new Logger(BillingService.name);

  constructor(
    protected readonly billingPlanRepo: BillingPlanRepository,
    protected readonly billingRepo: BillingRepository,
    protected readonly billingEvent: EventEmitter2,
  ) {}

  async addPlan(inPlan: BillingPlanDto): Promise<BillingPlan> {
    const found = await this.billingPlanRepo.findOneByTypeOrName(
      inPlan.name,
      inPlan.type,
    );
    if (found) {
      throw new HttpException(
        `
      ${
        found.name == inPlan.name && found.type == inPlan.type
          ? 'name & type'
          : found.name == inPlan.name
            ? 'name'
            : 'type'
      } already exist
      `,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return this.billingPlanRepo.createPlan(inPlan);
  }

  findAllBillingPlansRecords(
    queries: FindDataRequestDto,
  ): Promise<PaginationData> {
    return this.billingPlanRepo.findAllRecords({
      take: +queries.take,
      skip: +queries.skip,
    });
  }

  findOneBillingPlan(
    findOpts: FindOneOptions<BillingPlan>,
  ): Promise<BillingPlan> {
    return this.billingPlanRepo.findOne(findOpts);
  }

  findOneBillingPlanByName(name: string): Promise<BillingPlan> {
    return this.billingPlanRepo.findOne({ where: { name } });
  }

  findOneBillingPlanByType(type: string): Promise<BillingPlan> {
    return this.billingPlanRepo.findOne({ where: { type } });
  }

  protected async processBillings() { // TODO: Use queue to processBillings to reduce failure rate.
    const { records } = await this.billingRepo.findAllRecords({});
    records.forEach((bill: Billing) => {
      if (BillingUtils.billIsDue(bill.billAt) && !bill.paid) {
        // Push in billing processor
        bill.paid = true;
        this.billingRepo.changePaidStatus(bill.id, true);
        this.logger.verbose('Pushing billing info to billing processor');
      }
    });
    this.logger.debug('Running billing process');
  }
}
