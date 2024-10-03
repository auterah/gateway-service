import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import Customer from '../entities/customer.entity';
import { Roles } from 'src/shared/enums/roles';

export class CustomerDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles;
}
