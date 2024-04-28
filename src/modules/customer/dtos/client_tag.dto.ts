import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import ClientTag from '../entities/client_tag.entity';
import { Type } from 'class-transformer';

export class ClientTagDto extends ClientTag {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class BulkClientTagDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ClientTagDto)
  @ArrayNotEmpty()
  tags: ClientTagDto[];
}

export class BulkDeleteClientTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: string[];
}

export class AssignBulkClientTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  clients: string[];

  @IsOptional()
  @IsBoolean()
  strict = false;
}
