import { IsOptional, IsString, Allow, IsNumberString } from 'class-validator';

export class FindDataRequestDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  searchParam: string;

  @IsOptional()
  year: string;

  @IsOptional()
  type: string;

  @IsOptional()
  param: string;

  @IsOptional()
  value: string;

  @IsOptional()
  from: string;

  @IsOptional()
  to: string;

  @IsOptional()
  @IsNumberString()
  skip = '0';

  @IsOptional()
  @IsNumberString()
  take = '10';

  @IsOptional()
  @IsString()
  month: string;

  @IsOptional()
  @IsString()
  period: string;

  @IsOptional()
  @IsString()
  searchBy: string;

  @IsOptional()
  usepaginate?: 'false' | 'true' = 'true';

  @IsOptional()
  date?: string;

  @IsOptional()
  year1?: string;

  @IsOptional()
  year2?: string;
}
