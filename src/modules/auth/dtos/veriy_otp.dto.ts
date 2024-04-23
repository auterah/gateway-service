import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import Customer from 'src/modules/customer/entities/customer.entity';

export class VerifyOtpDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otp: number;
}
