import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import { Currency } from '../entities/currency.entity';
import { CurrencyEvents } from 'src/shared/events/currency.events';

@Injectable()
export class CurrencyRepository {
  private logger = new Logger(CurrencyRepository.name);
  constructor(
    @InjectRepository(Currency)
    private readonly currEntity: Repository<Currency>,
    public currEvent: EventEmitter2,
  ) {}

  // Create Currency
  async create(inCurr: Partial<Currency>): Promise<Currency> {
    const itExist = await this.currEntity.findOne({
      where: {
        name: inCurr.name,
      },
    });

    if (itExist) {
      throw new HttpException(
        'Sorry. Currency already exist',
        HttpStatus.CONFLICT,
      );
    }

    const newCurr = this.currEntity.create(inCurr);
    const currency = await this.currEntity.save(newCurr);
    this.currEvent.emit(CurrencyEvents.CREATED, currency);
    return currency;
  }

  // FindOne Currency
  findOne(findOpts: FindOneOptions<Currency>): Promise<Currency> {
    return this.currEntity.findOne(findOpts);
  }

  // Fetch All Currencies
  async findAllRecords(
    findOpts: FindManyOptions<Currency>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.currEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // UpdateOne Currency
  async updateOne(id: string, updates: Partial<Currency>): Promise<void> {
    await this.currEntity.update({ id }, updates);
  }

  // Delete Currency
  async deleteOne(id: string): Promise<boolean> {
    const curr = await this.findOne({
      where: { id },
    });
    if (!curr) {
      throw new HttpException(
        'Invalid Currency',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    await this.currEntity.remove(curr);
    return true;
  }
}
