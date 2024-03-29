import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Customer from 'src/modules/customer/customer.entity';

export class OtpSignInDto extends Customer {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
