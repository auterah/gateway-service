import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleService } from '../authorization/role/role.service';
import { AdminRepository } from './admin.repository';
import { AdminDto } from './dtos/admin.dto';
import Admin from './admin.entity';
import { PaginationData } from 'src/shared/types/pagination';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly roleService: RoleService,
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
}
