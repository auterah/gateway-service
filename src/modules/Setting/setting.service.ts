import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Setting from './setting.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { PaginationData } from 'src/shared/types/pagination';
import { MailEvents } from 'src/shared/events/mail.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SettingService {
  private logger = new Logger(SettingService.name);
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    private event: EventEmitter2,
  ) {
    // this.retrieveMailCredentials();
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

    const apps = await this.settingRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(apps, skip, take);
  }

  async retrieveMailCredentials() {
    this.logger.debug('Setting up SMTP configs...');

    try {
      const { records } = await this.findAllRecords({
        where: { type: 'smtp' },
      });

      const smtpCredentials: any = records
        .map((setting: Setting) => ({
          key: setting.skey,
          value: setting.value,
        }))
        .reduce((acc, { key, value }) => {
          const newKey = key.replace('smtp_', '');
          acc[newKey] = value;
          return acc;
        }, {});

      if (Object.entries(smtpCredentials).length == 0) {
        throw 'App is missing SMTP credentials ❌❌❌❌❌';
      }

      this.logger.debug('SMTP Configs are ready for use! 🎯🎯🎯🎯🎯🎯🎯🎯🎯');
      this.event.emit(MailEvents.SET_SMTP, smtpCredentials);
    } catch (e) {
      this.logger.error(`getSettingsVarsError: ${JSON.stringify(e)}`);
    }
  }
}
