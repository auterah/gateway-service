import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EvemitterService } from 'src/shared/evemitter/evemitter.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Role from './role.entity';
import { RoleDto } from '../dtos/mail.dto';
import { RoleEvents } from 'src/shared/events/roles.events';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { PaginationData } from 'src/shared/types/pagination';
import { defaultRoles } from '../constants/default_roles';
import { configs } from 'config/config.env';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly permissionService: PermissionService,
    private roleEvents: EvemitterService<Role>,
  ) {
    this.setRolesToMemo(); // setRolesToMemo sets all roles to app memory
    if (configs.SYNC_SEEDERS) {
      // seed default permissions
      defaultRoles.forEach(async ({ role }) => {
        const _role: RoleDto = { role };
        try {
          await this.createRole(_role);
        } catch (e) {
          console.warn(`Role ["${role}"] already exist`);
        }
      });
    }
  }

  async createRole(roleDto: RoleDto): Promise<Role> {
    const exist = await this.findOneByRolename(roleDto.role);
    if (exist) {
      throw new HttpException('Role already exist', HttpStatus.BAD_REQUEST);
    }

    const newRole = this.roleRepo.create(roleDto);
    const role = await this.roleRepo.save(newRole);

    // Emit new role event
    this.roleEvents.emitEvent<Role>({
      ev: RoleEvents.CREATED,
      payload: role,
    });

    return role;
  }

  // Find Single Role
  findOne(findOpts: FindOneOptions<Role>): Promise<Role> {
    return this.roleRepo.findOne(findOpts);
  }

  // Find Role By Rolename
  findOneByRolename(role: string): Promise<Role> {
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
    return this.roleRepo.save(role);
  }

  // Find All Roles
  async findAllRecords(
    findOpts: FindManyOptions<Role>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const roles = await this.roleRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(roles, skip, take);
  }

  /**
   * setRolesToMemo sets all roles to app memory
   */
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
