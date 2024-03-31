import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import Customer from '../customer.entity';
import { Roles } from 'src/shared/enums/roles';

export class CustomerDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
