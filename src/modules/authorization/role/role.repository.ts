import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Role from './role.entity';
import { RoleDto } from '../dtos/mail.dto';
import { RoleEvents } from 'src/shared/events/roles.events';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { PaginationData } from 'src/shared/types/pagination';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RoleRepository {
  private logger = new Logger(RoleRepository.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly roleEvents: EventEmitter2,
  ) {
    this.setRolesToMemo(); // setRolesToMemo sets all roles to app memory
  }

  async create(roleDto: RoleDto): Promise<Role> {
    const newRole = this.roleRepo.create(roleDto);
    const role = await this.roleRepo.save(newRole);
    // Emit new role event
    this.roleEvents.emit(RoleEvents.CREATED, role);
    return role;
  }

  // Find Single Role
  findOne(findOpts: FindOneOptions<Role>): Promise<Role> {
    return this.roleRepo.findOne(findOpts);
  }

  // Find All Roles
  async findAndCount(findOpts: FindManyOptions<Role>): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const roles = await this.roleRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(roles, skip, take);
  }

  // Update Role
  update(id: string, updates: Partial<Role>): Promise<any> {
    return this.roleRepo.update({ id }, updates);
  }

  /**
   * setRolesToMemo sets all roles to app memory
   */
  private async setRolesToMemo(): Promise<void> {
    const { records } = await this.findAndCount({});
    global.ROLES = records;
    this.logger.debug(`Total roles in memory: ${records.length}`);
  }

  /**
   * getFromMemoById finds a role from app memory
   * @param {string} id - role id.
   */
  static getFromMemoById(id: string): Role {
    const roles: Role[] = global.ROLES;
    return roles.find((e) => e.id == id);
  }
}
