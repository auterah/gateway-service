import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Setting from './entities/setting.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { PaginationData } from 'src/shared/types/pagination';
import { MailEvents } from 'src/shared/events/mail.events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AdminEvents } from 'src/shared/events/admin.events';
import { GDefaultBilling } from 'src/global/globals';
import { FsService } from '../file/file.service';
import { TargetRepository } from './repositories/target.repository';
import { AvailableRoute } from 'src/shared/types/app_bootstrap';
import Target from './entities/target.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';


@Injectable()
export class SettingService {
  private logger = new Logger(SettingService.name);
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    private event: EventEmitter2,
    private targetRepo: TargetRepository,
  ) {}

  // Create
  create(newSet: Partial<Setting>): Promise<Setting> {
    const setting = this.settingRepo.create(newSet);
    return this.settingRepo.save(setting);
  }

  // Create many
  createMany(newSettings: Partial<Setting>[]): Promise<Setting[]> {
    const settings: Partial<Setting>[] = [];

    for (const newSet of newSettings) {
      const setting = this.settingRepo.create(newSet);
      settings.push(setting);
    }

    this.logger.debug(`Saved ${settings.length} settings`);
    return this.settingRepo.save(settings);
  }

  // Find Setting By Skey
  async findByKey(skey: string): Promise<Setting> {
    return this.settingRepo.findOne({ where: { skey } });
  }

  // Find Setting By Type
  async findByType(type: string): Promise<Setting> {
    return this.settingRepo.findOne({ where: { type } });
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

  // Delete Settings
  async delete(setting: Partial<Setting>): Promise<void> {
    await this.settingRepo.delete(setting);
  }

  // Update Setting
  async updateOne(
    where: FindOptionsWhere<Setting>,
    updates: Partial<Setting>,
    returnNew = false,
  ): Promise<Setting | void> {
    await this.settingRepo.update(where, updates);
    if (returnNew) this.settingRepo.findOne({ where: { id: where.id } });
  }

  @OnEvent(AdminEvents.SMTP_SET)
  async memorizeSmtpConfigs() {
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

      this.logger.log('SMTP Configs are ready for use! 🎯🎯🎯🎯🎯🎯🎯🎯🎯');
      this.event.emit(MailEvents.SET_SMTP, smtpCredentials);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async memorizeDefaultBilling() {
    try {
      const billing = await this.findByType('billing');

      if (!billing) {
        this.logger.warn('App is missing default billing cost ❌❌❌❌❌');
        return;
      }

      GDefaultBilling.set(+billing.value); // Globalize default billing

      this.logger.log('Default email billing cost is set! 🤑🤑🤑🤑🤑');
    } catch (e) {
      this.logger.error(e);
    }
  }

  async savePermissionTargets() {
    const { totalItems } = await this.targetRepo.findAllRecords({});
    const availableRoutes = await FsService.readFile('targets.json');

    try {
      const targets: AvailableRoute[] = JSON.parse(availableRoutes);
      const routes = targets.map((e) => ({
        target: e.route.path,
      }));

      if (totalItems == routes.length) return;

      this.targetRepo.addManyTarget(routes as unknown as Partial<Target>[]);
    } catch (e) {
      this.logger.error(
        `Error saving permission targets: ${JSON.stringify(e)}`,
      );
    }
  }

  // Find All Target Records
  async findAllTargetRecords(queries: FindDataRequestDto): Promise<any> {
    return this.targetRepo.findAllRecords({});
  }
}
