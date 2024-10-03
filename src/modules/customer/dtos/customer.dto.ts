import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import Customer from '../entities/customer.entity';
import { Roles } from 'src/shared/enums/roles';
import { IsMultiCountryCode } from 'src/shared/validators/phone_number.validator';

export class CustomerDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsMultiCountryCode()
  @IsNotEmpty()
  phone: string;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles;
}
