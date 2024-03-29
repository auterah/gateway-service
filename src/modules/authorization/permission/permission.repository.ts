import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Permission from './permission.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { calculate_pagination_data } from 'src/shared/utils/pagination';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  // Create New Permission
  async createPermission(permInputs: Partial<Permission>): Promise<Permission> {
    const newPerm = this.permRepo.create(permInputs);
    return this.permRepo.save(newPerm);
  }

  // Find Single Permission
  findOne(findOpts: FindOneOptions<Permission>): Promise<Permission> {
    return this.permRepo.findOne(findOpts);
  }

  // Find Permission By Action
  findOneByAction(action: string): Promise<Permission> {
    return this.findOne({
      where: { action },
    });
  }

  // Find Permission By Id
  findOneById(
    id: string,
    findOpts?: FindOneOptions<Permission>,
  ): Promise<Permission> {
    return this.findOne({
      ...findOpts,
      where: { id },
    });
  }

  // Find permissions by IDs
  async findByIds(ids: string[]): Promise<Permission[]> {
    const permissions: Permission[] = [];
    for (const id of ids) {
      const permission = await this.permRepo.findOne({ where: { id } });
      permissions.push(permission);
    }
    return permissions;
  }

  // Find All Permissions
  async findAllRecords(
    findOpts: FindManyOptions<Permission>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const permissions = await this.permRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(permissions, skip, take);
  }
}
