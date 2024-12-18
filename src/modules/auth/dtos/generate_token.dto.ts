import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Customer from 'src/modules/customer/entities/customer.entity';

export class GenTokenDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
