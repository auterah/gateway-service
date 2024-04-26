import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerEncryptionDto {
  @IsString()
  @IsNotEmpty()
  encryptionKey: string;
}
