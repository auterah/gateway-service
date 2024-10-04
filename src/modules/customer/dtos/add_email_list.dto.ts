import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddEmailList {
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  emailList: string[];

  @IsString()
  appId: string;
}
