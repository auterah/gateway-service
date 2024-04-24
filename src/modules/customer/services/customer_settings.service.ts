import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindOneOptions, FindManyOptions } from 'typeorm';
import CustomerSettings from '../entities/customer_settings.entity';
import { CustomerSettingsRepository } from '../repositories/customer_settings.repository';
import { SettingEvents } from 'src/shared/events/setting.events';
import Customer from '../entities/customer.entity';

@Injectable()
export class CustomerSettingsService {
  constructor(
    private readonly customerSettRepo: CustomerSettingsRepository,
    private customerSettEvent: EventEmitter2,
  ) {}

  // Find Customer Settings
  findCustomerSetting(customerId: string): Promise<CustomerSettings> {
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
    let settings = await this.findCustomerSetting(customer.id);
    if (!settings) {
      settings = await this.customerSettRepo.create({
        customerId: customer.id,
        ...updates,
      });
    } else {
      Object.assign(settings, updates);
      await this.customerSettRepo.updateOne(customer.id, updates);
    }
    this.customerSettEvent.emit(SettingEvents.ADDED_CUSTOMER_SETTING, settings);
    return settings;
  }
}
