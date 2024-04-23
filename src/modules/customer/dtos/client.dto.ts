import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import Client from '../entities/client.entity';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import ClientTag from '../entities/client_tag.entity';

export class ClientDto extends Client {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: ClientTag[];
}

export class BulkClientDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ClientDto)
  @ArrayNotEmpty()
  clients: ClientDto[];
}
