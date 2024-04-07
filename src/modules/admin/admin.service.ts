import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleService } from '../authorization/role/role.service';
import { AdminRepository } from './admin.repository';
import { AdminDto } from './dtos/admin.dto';
import Admin from './admin.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { SettingService } from '../Setting/setting.service';
import { SmtpDto } from './dtos/smtp.dto';
import Setting from '../Setting/entities/setting.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminEvents } from 'src/shared/events/admin.events';
import { BillingDto } from './dtos/billing.dto';
import App from '../app/entities/app.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminEvents: EventEmitter2,
    private readonly adminRepository: AdminRepository,
    private readonly roleService: RoleService,
    private readonly settingService: SettingService,
    private readonly dataSource: DataSource,
  ) {
    this.settingService.memorizeSmtpConfigs();
    this.settingService.memorizeDefaultBilling();
    this.settingService.savePermissionTargets();
  }

  // Add New Admin
  async addAdmin(adminDto: AdminDto): Promise<Admin> {
    const exist = await this.adminRepository.findOneByEmail(adminDto.email);
    if (exist) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (adminDto.role) {
      const role = await this.roleService.findOneByRolename(adminDto.role);
      if (!role) {
        throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
      }
      adminDto.role = role.role;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(adminDto.password, salt);
    adminDto.password = hashPassword;
    return this.adminRepository.create(adminDto);
  }

  // Find Admin
  findOne(findOpts: FindOneOptions<Admin>): Promise<Admin> {
    return this.adminRepository.findOne(findOpts);
  }

  // Find Cutomer By Email
  findOneByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOneByEmail(email);
  }

  // Fetch All Admins
  findAllRecords(findOpts: FindManyOptions<Admin>): Promise<PaginationData> {
    return this.adminRepository.findAllRecords(findOpts);
  }

  // Update Admin
  async update(id: string, updates: Partial<Admin>): Promise<any> {
    const update = await this.adminRepository.update(id, updates);
    return update;
  }

  async addSMTPConfigs(smtpDto: SmtpDto): Promise<void> {
    const smtps: Partial<Setting>[] = [];

    for (const key in smtpDto) {
      if (Object.prototype.hasOwnProperty.call(smtpDto, key)) {
        const value = smtpDto[key];
        smtps.push({
          value,
          name: `SMTP ${key.toUpperCase()}`,
          type: 'smtp',
          skey: `smtp_${key}`,
          length: 'short',
        });
      }
    }
    await this.settingService.delete({ type: 'smtp' });
    const records = await this.settingService.createMany(smtps);
    if (records.length) {
      this.adminEvents.emit(AdminEvents.SMTP_SET);
    }
  }

  // Fetch All Configs
  findAllConfigRecords(findOpts: FindDataRequestDto): Promise<PaginationData> {
    return this.settingService.findAllRecords({
      skip: Number(findOpts.skip || '0'),
      take: Number(findOpts.take || '10'),
    });
  }

  // Set Billings
  async setBilling(billingDto: BillingDto): Promise<Setting | Partial<App>> {
    const cost = billingDto.cost.toString();
    const _type = 'billing';
    if (billingDto.appId) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const appRepository = queryRunner.manager.getRepository(App);
      const found = await appRepository.findOne({
        where: { id: billingDto.appId },
      });

      if (!found) {
        throw new HttpException('Invalid app', HttpStatus.EXPECTATION_FAILED);
      }
      appRepository.update({ id: billingDto.appId }, { cost: +cost });

      await queryRunner.commitTransaction();

      delete found.scopes;
      delete found.privateKey;
      delete found.publicKey;
      return found;
    }

    const billing = await this.settingService.findOne({
      where: { type: _type },
    });

    if (billing) {
      billing.value = cost;
      await this.settingService.updateOne({ id: billing.id }, billing);
      return billing;
    }
    return this.settingService.create({
      skey: 'mail_billing_cost',
      value: cost,
      name: 'Mail Billing Cost',
      type: _type,
      length: 'short',
    });
  }

  // Fetch Billings
  async getBillings(): Promise<Setting> {
    return this.settingService.findByType('billing');
  }

  // Fetch App Billings
  async getAppBillings(appId: string): Promise<Partial<App>> {
    if (appId) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const appRepository = queryRunner.manager.getRepository(App);

      const found = await appRepository.findOne({
        where: { id: appId },
      });

      await queryRunner.commitTransaction();

      if (found) {
        delete found.scopes;
        delete found.privateKey;
        delete found.publicKey;
        return found;
      }
      return null;
    }
    throw new HttpException(
      'App required. Specify app_id=?',
      HttpStatus.BAD_REQUEST,
    );
  }
}
