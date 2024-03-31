import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Permission from './permission.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { RoleEvents } from 'src/shared/events/roles.events';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  private logger = new Logger(PermissionService.name);

  constructor(private readonly permRepo: PermissionRepository) {
    this.setPermissionsToMemo();
  }

  @OnEvent(RoleEvents.CREATED)
  async createPermission(permDto: PermissionDto): Promise<Permission> {
    const exist = await this.findOneByAction(permDto.action);
    if (exist) {
      throw new HttpException(
        'A action / permission already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.permRepo.createPermission(permDto);
  }

  // Find Single Permission
  findOne(findOpts: FindOneOptions<Permission>): Promise<Permission> {
    return this.permRepo.findOne(findOpts);
  }

  // Find Permission By Action
  findOneByAction(action: string): Promise<Permission> {
    return this.permRepo.findOneByAction(action);
  }

  // Find Permission By Id
  findOneById(
    id: string,
    findOpts?: FindOneOptions<Permission>,
  ): Promise<Permission> {
    return this.findOneById(id, findOpts);
  }

  // Find Permission By IDS
  findByIds(ids: string[], strict = false): Promise<Permission[]> {
    return this.permRepo.findByIds(ids, strict);
  }

  /**
   * setPermissionsToMemo sets all permissions to app memory
   */
  private async setPermissionsToMemo(): Promise<void> {
    const { records } = await this.permRepo.findAllRecords({});
    global.PERMISSIONS = records;
    this.logger.debug(`Total scopes in memory: ${records.length}`);
  }

  /**
   * getFromMemoById finds a permission from app memory
   * @param {string} id - permission id.
   */
  static getFromMemoById(id: string): Permission[] {
    const permissions: any[] = global.PERMISSIONS;
    return permissions.find((e) => e.id == id);
  }

  /**
   * getFromMemoById finds a role from app memory
   * @param {string} target - endpoint OR route.
   */
  static getFromMemoByTarget(target: string): Permission {
    const permissions: Permission[] = global.PERMISSIONS;
    return permissions.find((e) => e.target == target);
  }
}
