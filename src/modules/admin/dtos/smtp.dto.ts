import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SmtpDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;

  @IsString()
  @IsNotEmpty()
  user: string;
}
