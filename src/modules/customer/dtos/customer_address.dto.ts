import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import CustomerAddress from '../entities/customer_address.entity';

export class CustomerAddressDto extends CustomerAddress {
  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  officeCode: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsString()
  @IsOptional()
  regionId: string;
}
