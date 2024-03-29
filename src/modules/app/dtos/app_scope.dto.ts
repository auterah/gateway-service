import { ArrayNotEmpty, IsArray, IsString, IsNotEmpty } from 'class-validator';
import App from '../entities/app.entity';

export class AppScopeDto extends App {
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  scopes: [];
}
