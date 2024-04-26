import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../entities/currency.entity';
import { CurrencyDto } from '../dtos/currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly currRepo: CurrencyRepository) {}

  // Create New Currency
  create(currDto: Partial<CurrencyDto>): Promise<Currency> {
    return this.currRepo.create(currDto);
  }

  // FindOne Currency
  findOne(findOpts: FindOneOptions<Currency>): Promise<Currency> {
    return this.currRepo.findOne(findOpts);
  }

  // Fetch All Currencies
  findAllRecords(findOpts: FindManyOptions<Currency>): Promise<PaginationData> {
    return this.currRepo.findAllRecords(findOpts);
  }

  // Update Currency By Id
  async updateOneById(
    id: string,
    updates: Partial<Currency>,
    _return = false,
  ): Promise<void | Currency> {
    const findOpt = { id };
    const currency = await this.findOne({
      where: findOpt,
    });

    if (!currency) {
      throw new HttpException(
        'Invalid Currency',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (updates.name && currency.name == updates.name) {
      throw new HttpException(
        'Try another name. Currency already exist',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (updates.name && currency.name == updates.name) {
      //TODO: Make a request to fetch symbol and code for Currency
    }

    await this.currRepo.updateOne(id, updates);
    if (_return) {
      Object.assign(currency, updates);
      return currency;
    }
  }

  // Find Currency By Id
  async findOneById(id: string): Promise<Currency> {
    return this.currRepo.findOne({ where: { id } });
  }

  // DeleteOne Currency
  deleteOne(findOpts: Partial<Currency>): Promise<boolean> {
    return this.currRepo.deleteOne(findOpts.id);
  }
}
