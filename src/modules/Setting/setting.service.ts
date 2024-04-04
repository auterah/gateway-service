import { Injectable, Logger } from '@nestjs/common';
import Setting from './setting.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { MailEvents } from 'src/shared/events/mail.events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SettingRepository } from './setting.repository';
import { AdminEvents } from 'src/shared/events/admin.events';

@Injectable()
export class SettingService {
  private logger = new Logger(SettingService.name);
  constructor(
    private readonly settingRepo: SettingRepository,
    private event: EventEmitter2,
  ) {
    // this.retrieveMailCredentials();
  }

  // Add new setting
  addSetting(newSet: Partial<Setting>): Promise<Setting> {
    return this.settingRepo.create(newSet);
  }

  async addMany(newSettings: Partial<Setting>[]): Promise<Setting[]> {
    return this.settingRepo.createMany(newSettings);
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
    return this.settingRepo.findAllRecords(findOpts);
  }

  @OnEvent(AdminEvents.SMTP_SET)
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
      this.logger.error(
        `${this.retrieveMailCredentials.name}: ${JSON.stringify(e)}`,
      );
    }
  }
}
