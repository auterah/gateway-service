import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingPlanRepository } from './repositories/billing_plan.repository';
import { BillingPlanDto } from './dtos/billing_plan.dto';
import BillingPlan from './entities/billing_plan.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class BillingService {
  constructor(
    private readonly billingPlanRepo: BillingPlanRepository,
    private readonly billingEvent: EventEmitter2,
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
}
