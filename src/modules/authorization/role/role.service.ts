import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import Role from './role.entity';
import { RoleDto } from '../dtos/mail.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { PermissionService } from '../permission/permission.service';
import { Roles } from 'src/shared/enums/roles';
import { RoleRepository } from './role.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { RoleEvents } from 'src/shared/events/roles.events';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async createRole(roleDto: RoleDto): Promise<Role> {
    const exist = await this.findOneByRolename(roleDto.role);
    if (exist) {
      throw new HttpException('Role already exist', HttpStatus.BAD_REQUEST);
    }
    return this.roleRepo.create(roleDto);
  }

  // Find Single Role
  findOne(findOpts: FindOneOptions<Role>): Promise<Role> {
    return this.roleRepo.findOne(findOpts);
  }

  // Find Role By Rolename
  findOneByRolename(role: Roles): Promise<Role> {
    return this.findOne({
      where: { role },
    });
  }
  // Find Role By Id
  findOneById(id: string, findOpts?: FindOneOptions<Role>): Promise<Role> {
    return this.findOne({
      ...findOpts,
      where: { id },
    });
  }

  // Add Permission to role
  async addPermission(roleId: string, permId: string): Promise<Role> {
    const role = await this.findOneById(roleId, {
      relations: ['permissions'],
    });

    if (!role) {
      throw new HttpException('Invalid role', HttpStatus.PRECONDITION_FAILED);
    }
    const permission = await this.permissionService.findOneById(permId);

    if (!permission) {
      throw new HttpException(
        'Invalid permission',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    // check if permission exist
    const exist = role.permissions.find((perm) => perm.id == permission.id);
    if (exist) {
      throw new HttpException(
        'Permission already exist',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const permissions = role.permissions;
    permissions.push(permission);
    role.permissions = permissions;
    return this.roleRepo.update(role.id, role);
  }

  // Find All Roles
  async findAllRecords(
    findOpts: FindManyOptions<Role>,
  ): Promise<PaginationData> {
    return this.roleRepo.findAndCount(findOpts);
  }


  /**
   * setRolesToMemo sets all roles to app memory
   */
  @OnEvent(RoleEvents.SEEDED)
  private async setRolesToMemo(): Promise<void> {
    const { records } = await this.findAllRecords({});
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
