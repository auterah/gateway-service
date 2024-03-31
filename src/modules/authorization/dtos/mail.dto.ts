import { IsEnum, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import Role from '../role/role.entity';
import { Roles } from 'src/shared/enums/roles';

export class RoleDto extends PartialType(Role) {
  @IsEnum(Roles)
  role: Roles;
}
