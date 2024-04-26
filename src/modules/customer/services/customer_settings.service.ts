import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FindOneOptions, FindManyOptions } from 'typeorm';
import CustomerSettings from '../entities/customer_settings.entity';
import { CustomerSettingsRepository } from '../repositories/customer_settings.repository';
import { SettingEvents } from 'src/shared/events/setting.events';
import Customer from '../entities/customer.entity';
import { CustomerSettingDto } from '../dtos/customer_settings.dto';
import { CustomerEvents } from 'src/shared/events/customer.events';

@Injectable()
export class CustomerSettingsService {
  constructor(
    private readonly customerSettRepo: CustomerSettingsRepository,
    private customerSettEvent: EventEmitter2,
  ) {}

  // Init Customer Settings
  @OnEvent(CustomerEvents.CREATED)
  async initSettings(customer: Partial<Customer>): Promise<void> {
    const itExist = await this.customerSettRepo.findOne({
      where: { customerId: customer.id },
    });
    if (itExist) {
      return;
    }
    await this.create({ customerId: customer.id });
  }

  // Create Setting
  create(inSet: Partial<CustomerSettingDto>): Promise<CustomerSettings> {
    return this.customerSettRepo.create(inSet);
  }

  // Find Customer Settings
  findSettingsById(customerId: string): Promise<CustomerSettings> {
    return this.customerSettRepo.findOne({
      where: {
        customerId,
      },
    });
  }

  // Fetch All Settings
  findAllRecords(
    customerId: string,
    { where, ...findOpts }: FindManyOptions<CustomerSettings>,
  ): Promise<any> {
    return this.customerSettRepo.findAllRecords({
      where: {
        ...where,
        customerId,
      },
      ...findOpts,
    });
  }

  // Update Customer Settings
  async updateCustomerSetting(
    customer: Customer,
    updates: Partial<CustomerSettings>,
  ): Promise<CustomerSettings> {
    let settings = await this.findSettingsById(customer.id);
    if (!settings) {
      settings = await this.customerSettRepo.create({
        customerId: customer.id,
        ...updates,
      });
    } else {
      Object.assign(settings, updates);
      await this.customerSettRepo.updateOne(customer.id, updates);
    }
    this.customerSettEvent.emit(CustomerEvents.ADDED_SETTINGS, settings);
    return settings;
  }
}
