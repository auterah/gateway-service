import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import Role from '../role/role.entity';

export class RoleDto extends PartialType(Role) {
  @IsString()
  role: string;
}
