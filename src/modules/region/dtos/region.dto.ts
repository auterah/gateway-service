import { IsNotEmpty, IsString } from 'class-validator';
import { Region } from '../entities/region.entity';

export class RegionDto extends Region {
  @IsString()
  @IsNotEmpty()
  name: string;
}
