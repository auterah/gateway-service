import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/shared/enums/roles';
import Admin from '../admin.entity';

export class AdminDto extends Admin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles;
}
