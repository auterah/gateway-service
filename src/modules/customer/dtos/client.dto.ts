import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import Client from '../entities/client.entity';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import ClientTag from '../entities/client_tag.entity';
import { ClientSource } from '../enums/client_source.enum';

export class ClientDto extends Client {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  company: string;

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

  @IsEnum(ClientSource)
  @IsOptional()
  source: ClientSource;
}
