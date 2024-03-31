import { Module } from '@nestjs/common';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Permission from './permission/permission.entity';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import Role from './role/role.entity';
import { PermissionRepository } from './permission/permission.repository';
import { RoleRepository } from './role/role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Permission]),
  ],
  controllers: [RoleController, PermissionController],
  providers: [
    RoleService,
    PermissionService,
    PermissionRepository,
    RoleRepository,
  ],
  exports: [
    RoleService,
    PermissionService,
    PermissionRepository,
    RoleRepository,
  ],
})
export class AuthorizationModule {}
