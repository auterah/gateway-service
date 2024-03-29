import { IsString } from 'class-validator';
import Permission from '../permission/permission.entity';

export class PermissionDto extends Permission {
  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsString()
  target: string;
}
