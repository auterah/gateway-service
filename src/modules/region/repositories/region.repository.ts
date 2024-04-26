import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import { CurrencyEvents } from 'src/shared/events/currency.events';
import { Region } from '../entities/region.entity';

@Injectable()
export class RegionRepository {
  private logger = new Logger(RegionRepository.name);
  constructor(
    @InjectRepository(Region)
    private readonly regionEntity: Repository<Region>,
    public regionEvent: EventEmitter2,
  ) {}

  // Create Region
  async create(inRegion: Partial<Region>): Promise<Region> {
    const itExist = await this.regionEntity.findOne({
      where: {
        name: inRegion.name,
      },
    });

    if (itExist) {
      throw new HttpException(
        'Sorry. Region already exist',
        HttpStatus.CONFLICT,
      );
    }

    const newRegion = this.regionEntity.create(inRegion);
    const region = await this.regionEntity.save(newRegion);
    this.regionEvent.emit(CurrencyEvents.CREATED, region);
    return region;
  }

  // FindOne Region
  findOne(findOpts: FindOneOptions<Region>): Promise<Region> {
    return this.regionEntity.findOne(findOpts);
  }

  // Fetch All Currencies
  async findAllRecords(
    findOpts: FindManyOptions<Region>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.regionEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // UpdateOne Region
  async updateOne(id: string, updates: Partial<Region>): Promise<void> {
    await this.regionEntity.update({ id }, updates);
  }

  // Delete Region
  async deleteOne(id: string): Promise<boolean> {
    const region = await this.findOne({
      where: { id },
    });
    if (!region) {
      throw new HttpException('Invalid Region', HttpStatus.EXPECTATION_FAILED);
    }
    await this.regionEntity.remove(region);
    return true;
  }
}
