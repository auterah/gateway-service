import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleService } from '../authorization/role/role.service';
import { AdminRepository } from './admin.repository';
import { AdminDto } from './dtos/admin.dto';
import Admin from './admin.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { SettingService } from '../Setting/setting.service';
import { SmtpDto } from './dtos/smtp.dto';
import Setting from '../Setting/setting.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminEvents } from 'src/shared/events/admin.events';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly roleService: RoleService,
    private readonly settingService: SettingService,
    private readonly adminEvents: EventEmitter2,
  ) {}

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
    const records = await this.settingService.addMany(smtps);
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
}
