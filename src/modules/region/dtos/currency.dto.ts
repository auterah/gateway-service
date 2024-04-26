import { IsNotEmpty, IsString } from 'class-validator';
import { Currency } from '../entities/currency.entity';

export class CurrencyDto extends Currency {
  @IsString()
  @IsNotEmpty()
  name: string;
}
