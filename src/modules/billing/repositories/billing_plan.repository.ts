import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import BillingPlan from '../entities/billing_plan.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';

@Injectable()
export class BillingPlanRepository {
  private logger = new Logger(BillingPlanRepository.name);
  constructor(
    private billingPlanEvent: EventEmitter2,
    @InjectRepository(BillingPlan)
    private readonly billingPlanRepo: Repository<BillingPlan>,
  ) {}

  // Create Plan
  createPlan(inPlan: Partial<BillingPlan>): Promise<BillingPlan> {
    const newPlan = this.billingPlanRepo.create(inPlan);
    return this.billingPlanRepo.save(newPlan);
  }

  // Create Many Plans
  createManyPlans(inPlans: Partial<BillingPlan>[]): Promise<BillingPlan[]> {
    const plans: Partial<BillingPlan>[] = [];

    for (const inPlan of inPlans) {
      const newTarget = this.billingPlanRepo.create(inPlan);
      plans.push(newTarget);
    }

    this.logger.verbose(`Saved "${plans.length}" billing plans`);
    return this.billingPlanRepo.save(plans);
  }

  // Find One Plan
  findOne(findOpts: FindOneOptions<BillingPlan>): Promise<BillingPlan> {
    return this.billingPlanRepo.findOne(findOpts);
  }

  // Find One Plan By Type OR Name
  findOneByTypeOrName(name: string, type: string): Promise<BillingPlan> {
    return this.billingPlanRepo
      .createQueryBuilder('billing_plans')
      .where('type = :type', { type })
      .orWhere('name = :name', { name })
      .getOne();
  }

  // Fetch All Plans
  async findAllRecords(
    findOpts: FindManyOptions<BillingPlan>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.billingPlanRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }
}
