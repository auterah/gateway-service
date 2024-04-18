import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import Billing from '../entities/billing.entity';

@Injectable()
export class BillingRepository {
  private logger = new Logger(BillingRepository.name);
  constructor(
    protected billingEvent: EventEmitter2,
    @InjectRepository(Billing)
    protected readonly billingRepo: Repository<Billing>,
  ) {}

  // Create Bill
  createBill(inBill: Partial<Billing>): Promise<Billing> {
    const newBill = this.billingRepo.create(inBill);
    return this.billingRepo.save(newBill);
  }

  // Find One Bill
  findOne(findOpts: FindOneOptions<Billing>): Promise<Billing> {
    return this.billingRepo.findOne(findOpts);
  }

  // Fetch All Billings
  async findAllRecords(
    findOpts: FindManyOptions<Billing>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.billingRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }
}
