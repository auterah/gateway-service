import { IsString } from 'class-validator';
import App from '../entities/app.entity';

export class SignTokenDto extends App {
  @IsString()
  app_key: string;
}
