import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import Consumer from '../consumer.entity';
import { Type } from 'class-transformer';

export class ConsumerDto extends Consumer {
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

export class BulkConsumerDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ConsumerDto)
  @ArrayNotEmpty()
  consumers: ConsumerDto[];
}
