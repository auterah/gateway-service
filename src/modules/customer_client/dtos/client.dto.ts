import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import Client from '../client.entity';
import { Type } from 'class-transformer';

export class ClientDto extends Client {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: string[];
}

export class BulkClientDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ClientDto)
  @ArrayNotEmpty()
  clients: ClientDto[];
}
