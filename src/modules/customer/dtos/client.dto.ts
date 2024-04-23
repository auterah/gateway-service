import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import Client from '../entities/client.entity';
import { Type } from 'class-transformer';
import ClientTag from '../../customer/entities/client_tag.entity';

export class ClientDto extends Client {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  tags: ClientTag[];
}

export class BulkClientDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ClientDto)
  @ArrayNotEmpty()
  clients: ClientDto[];
}
