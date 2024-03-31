import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Admin from './admin.entity';
import { AdminEvents } from 'src/shared/events/admin.events';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';

@Injectable()
export class AdminRepository {
  constructor(
    private event: EventEmitter2,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  // Create Admin
  async create(adminDto: Admin): Promise<Admin> {
    const newAdmin = this.adminRepo.create(adminDto);
    const admin = await this.adminRepo.save(newAdmin);
    this.event.emit(AdminEvents.CREATED, admin);
    return admin;
  }

  // Find Admin
  findOne(findOpts: FindOneOptions<Admin>): Promise<Admin> {
    return this.adminRepo.findOne(findOpts);
  }

  // Find Admin By Email
  findOneByEmail(email: string): Promise<Admin> {
    return this.findOne({
      where: { email },
    });
  }

  // Fetch All Admins
  async findAllRecords(
    findOpts: FindManyOptions<Admin>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const admins = await this.adminRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(admins, skip, take);
  }

  // Update Admin
  update(id: string, updates: Partial<Admin>): Promise<any> {
    return this.adminRepo.update({ id }, updates);
  }
}
