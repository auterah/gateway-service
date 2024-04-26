import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CustomerAddressRepository } from '../repositories/customer_address.repository';
import CustomerAddress from '../entities/customer_address.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { CustomerAddressEvents } from 'src/shared/events/customer_address.events';
import Customer from '../entities/customer.entity';
import { RegionRepository } from 'src/modules/region/repositories/region.repository';

@Injectable()
export class CustomerAddressService {
  constructor(
    private readonly addressRepo: CustomerAddressRepository,
    private readonly regionRepository: RegionRepository,
    private addressEvent: EventEmitter2,
  ) {}

  // Add Address
  async create(customer: Customer, newAddress: Partial<CustomerAddress>) {
    if (newAddress.regionId) {
      const region = await this.regionRepository.findOneById(
        newAddress.regionId,
      );
      if (!region) {
        throw new HttpException(
          'Invalid Region',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    }
    const found = await this.addressRepo.findOne(customer.id, {});
    if (found) {
      await this.addressRepo.updateOne(found.id, customer.id, newAddress);
      Object.assign(found, newAddress);
      return found;
    }
    const address = await this.addressRepo.create({
      customer,
      customerId: customer.id,
      ...newAddress,
    });
    delete address.customer;
    return address;
  }

  // FindOne Address
  findOneById(
    customerId: string,
    findOpts: FindOneOptions<CustomerAddress>,
  ): Promise<CustomerAddress> {
    return this.addressRepo.findOne(customerId, findOpts);
  }

  // Fetch All Addresses
  findAllRecords(
    customerId: string,
    findOpts: FindManyOptions<CustomerAddress>,
  ): Promise<PaginationData> {
    return this.addressRepo.findAllRecords(customerId, findOpts);
  }

  // UpdateOne Address
  async updateOne(
    id: string,
    customer: Customer,
    updates: Partial<CustomerAddress>,
  ): Promise<CustomerAddress> {
    let address = await this.findOneById(customer.id, {
      where: { id },
    });
    if (!address) {
      address = await this.addressRepo.create({
        customer,
        customerId: customer.id,
        ...updates,
      });
    } else {
      Object.assign(address, updates);
      await this.addressRepo.updateOne(id, customer.id, updates);
    }
    if (updates.regionId) {
      const region = await this.regionRepository.findOneById(updates.regionId);
      if (!region) {
        throw new HttpException(
          'Invalid Region',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    }
    this.addressEvent.emit(CustomerAddressEvents.CREATED, address);
    delete address.customer;
    return address;
  }

  // DeleteOne Address
  deleteOne(
    customerId: string,
    delOpts: FindOneOptions<CustomerAddress>,
  ): Promise<boolean> {
    return this.addressRepo.deleteOne(customerId, delOpts);
  }
}
