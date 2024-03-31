import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Admin from 'src/modules/admin/admin.entity';

export class SignAdminToken extends Admin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
