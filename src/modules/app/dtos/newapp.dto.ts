import { IsNotEmpty, IsString } from 'class-validator';
import App from '../entities/app.entity';

export class AppDto extends App {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  domain: string;
}
