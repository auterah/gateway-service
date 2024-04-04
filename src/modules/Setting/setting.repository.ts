import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Setting from './setting.entity';
import {
  DeleteOptions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { PaginationData } from 'src/shared/types/pagination';

@Injectable()
export class SettingRepository {
  private logger = new Logger(SettingRepository.name);
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  // Create setting
  create(newSet: Partial<Setting>): Promise<Setting> {
    const newSetting = this.settingRepo.create(newSet);
    return this.settingRepo.save(newSetting);
  }

  // Create Many
  createMany(newSettings: Partial<Setting>[]) {
    const settings: Setting[] = [];
    for (const newSet of newSettings) {
      const setting = this.settingRepo.create(newSet);
      settings.push(setting);
    }
    return this.settingRepo.save(settings);
  }

  // Find Setting By Skey
  async findByKey(skey: string): Promise<Setting> {
    return this.settingRepo.findOne({ where: { skey } });
  }

  // Find Single Setting
  findOne(findOpts: FindOneOptions<Setting>): Promise<Setting> {
    return this.settingRepo.findOne(findOpts);
  }

  // Find All Records
  async findAllRecords(
    findOpts: FindManyOptions<Setting>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.settingRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Delete Settings
  async delete(delOpts: Partial<Setting>): Promise<void> {
    await this.settingRepo.delete(delOpts);
  }
}
