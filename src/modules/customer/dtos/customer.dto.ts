import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Customer from '../customer.entity';

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

  @IsString()
  @IsNotEmpty()
  role: string;
}
