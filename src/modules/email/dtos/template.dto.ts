import { IsString, IsOptional } from 'class-validator';
import Template from '../entities/template.entity';

export class TemplateDto extends Template {
  @IsString()
  html: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  screenShoot: string;
}
