import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CustomerEvents } from 'src/shared/events/customer.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CustomerAddress from '../entities/customer_address.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';

@Injectable()
export class CustomerAddressRepository {
  constructor(
    private addressEvent: EventEmitter2,
    @InjectRepository(CustomerAddress)
    private readonly addressEntity: Repository<CustomerAddress>,
  ) {}

  // Add Address
  async create(inAddress?: Partial<CustomerAddress>) {
    const newAddress = this.addressEntity.create(inAddress);
    const address = await this.addressEntity.save(newAddress);
    this.addressEvent.emit(CustomerEvents.CREATED_ADDRESS, address);
    return address;
  }

  // Find Address
  findOne(
    customerId: string,
    { where, ...findOpts }: FindOneOptions<CustomerAddress>,
  ): Promise<CustomerAddress> {
    return this.addressEntity.findOne({
      where: {
        customerId,
        ...where,
      },
      ...findOpts,
    });
  }

  // Fetch All Addresses
  async findAllRecords(
    customerId: string,
    findOpts: FindManyOptions<CustomerAddress>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.addressEntity.findAndCount({
      where: { customerId, ...findOpts.where },
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Update Address
  async updateOne(
    id: string,
    customerId: string,
    updates: Partial<CustomerAddress>,
  ): Promise<void> {
    await this.addressEntity.update({ id, customerId }, updates);
  }

  // Delete Address
  async deleteOne(
    customerId: string,
    delOpts: FindOneOptions<CustomerAddress>,
  ): Promise<boolean> {
    const region = await this.findOne(customerId, delOpts);
    if (!region) {
      throw new HttpException('Invalid Region', HttpStatus.EXPECTATION_FAILED);
    }
    await this.addressEntity.remove(region);
    return true;
  }
}
