import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import BillingThreshold from '../entities/billing_threshold.entity';

@Injectable()
export class BillingThresholdRepository {
  private logger = new Logger(BillingThresholdRepository.name);
  constructor(
    protected billingEvent: EventEmitter2,
    @InjectRepository(BillingThreshold)
    protected readonly threshRepo: Repository<BillingThreshold>,
  ) {}

  // Add Threshold
  addThreshold(inBill: Partial<BillingThreshold>): Promise<BillingThreshold> {
    const newBill = this.threshRepo.create(inBill);
    return this.threshRepo.save(newBill);
  }

  // Find A Threshold
  findOne(
    findOpts: FindOneOptions<BillingThreshold>,
  ): Promise<BillingThreshold> {
    return this.threshRepo.findOne(findOpts);
  }

  // Find Threshold By Id
  findById(id: string): Promise<BillingThreshold> {
    return this.threshRepo.findOne({
      where: {
        id,
      },
    });
  }

  findByNameORCostORThreshold({
    name,
    cost,
    threshold,
  }: Partial<BillingThreshold>): Promise<BillingThreshold> {
    return this.threshRepo
      .createQueryBuilder('billing_thresholds')
      .where('name  =:name', { name })
      .orWhere('cost = :cost', { cost })
      .orWhere('threshold = :threshold', { threshold })
      .getOne();
  }

  // Fetch All Thresholds
  async findAllRecords(
    findOpts: FindManyOptions<BillingThreshold>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.threshRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  get repo(): Repository<BillingThreshold> {
    return this.threshRepo;
  }
}
