import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CustomerEvents } from 'src/shared/events/customer.events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import CustomerSettings from '../entities/customer_settings.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { SettingEvents } from 'src/shared/events/setting.events';

@Injectable()
export class CustomerSettingsRepository {
  constructor(
    private customerSettEvent: EventEmitter2,
    @InjectRepository(CustomerSettings)
    private readonly customerSettEntity: Repository<CustomerSettings>,
  ) {}

  // Add Setting
  @OnEvent(CustomerEvents.CREATED)
  async create(inSetting?: Partial<CustomerSettings>) {
    const newSetting = this.customerSettEntity.create(inSetting);
    const settings = await this.customerSettEntity.save(newSetting);
    this.customerSettEvent.emit(SettingEvents.ADDED_CUSTOMER_SETTING, settings);
    return settings;
  }

  // Find Settings
  findOne(
    findOpts: FindOneOptions<CustomerSettings>,
  ): Promise<CustomerSettings> {
    return this.customerSettEntity.findOne(findOpts);
  }

  // Fetch All Settings
  async findAllRecords(
    findOpts: FindManyOptions<CustomerSettings>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.customerSettEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Update Setting
  async updateOne(
    customerId: string,
    updates: Partial<CustomerSettings>,
  ): Promise<void> {
    await this.customerSettEntity.update({ customerId }, updates);
  }
}
