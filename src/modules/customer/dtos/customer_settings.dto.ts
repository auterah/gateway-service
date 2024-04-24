import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import CustomerSettings from '../entities/customer_settings.entity';
import { StrictDtoValidator } from 'src/shared/validators/strict-dto-validator';

export class CustomerSettingDto extends CustomerSettings {
  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  favicon: string;
}
