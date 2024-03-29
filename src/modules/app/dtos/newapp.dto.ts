import { IsString } from 'class-validator';
import App from '../entities/app.entity';

export class AppDto extends App {
  @IsString()
  name: string;
}
