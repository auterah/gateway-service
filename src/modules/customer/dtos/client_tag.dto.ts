import {
  ArrayNotEmpty,
  IsNotEmpty,
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
