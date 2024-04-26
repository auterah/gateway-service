import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { RegionRepository } from '../repositories/region.repository';
import { Region } from '../entities/region.entity';
import { RegionDto } from '../dtos/region.dto';
import { Currency } from '../entities/currency.entity';
import { RegionInfoType } from '../interfaces/region_providers';
import { ERegionProviders } from '../enums/region_providers';
import { CurrencyService } from './currency.service';
import { RegionFactory } from '../factories/region.factory';

@Injectable()
export class RegionService {
  constructor(
    private readonly regionRepo: RegionRepository,
    private readonly currencyService: CurrencyService,
    private readonly regionAPIProviderClass: RegionFactory,
  ) {}

  // Create New Region
  async create(regionDto: RegionDto): Promise<any> {
    // if (!regionDto.auto && !regionDto.regionDetails) {
    //   throw new HttpException(
    //     'If auto is not set, regionDetails is required in Region payload',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const regions: Region[] = (await this.regionRepo.findAllRecords({}))
      .records;

    const regionInfo: RegionInfoType = await this.regionAPIProviderClass
      .findOne(ERegionProviders.Restcountries)
      .getRegion(regionDto.name);

    if (!regionInfo) {
      throw new HttpException(
        'Sorry. Something went wrong kindly contact support',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const currencies: Currency[] = (
      await this.currencyService.findAllRecords({})
    ).records;

    const regionExist = regions.find(
      (region) =>
        region.name === regionInfo?.region.name ||
        region.code === regionInfo?.region.code,
    );

    if (regionExist) {
      throw new HttpException(
        'Sorry. Region already exist',
        HttpStatus.CONFLICT,
      );
    }

    const currency: Currency = await this.currencyService.create({
      name: regionInfo.currency.name,
      code: regionInfo.currency.code,
      symbol: regionInfo.currency.symbol,
      default: !currencies.length,
      active: !currencies.length,
    });

    const newRegion = this.regionRepo.create({
      currency,
      ...regionInfo.region,
      default: !regions.length,
      active: !regions.length,
    });
    return newRegion;
  }

  // FindOne Region
  findOne(findOpts: FindOneOptions<Region>): Promise<Region> {
    return this.regionRepo.findOne(findOpts);
  }

  // Fetch All Regions
  findAllRecords(findOpts: FindManyOptions<Region>): Promise<PaginationData> {
    return this.regionRepo.findAllRecords(findOpts);
  }

  // Update Region By Id
  async updateOneById(
    id: string,
    updates: Partial<Region>,
    _return = false,
  ): Promise<void | Region> {
    const findOpt = { id };
    const region = await this.findOne({
      where: findOpt,
    });

    if (!region) {
      throw new HttpException(
        'Invalid Currency',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (updates.name && region.name == updates.name) {
      //TODO: Make a request to update Currency
    }

    await this.regionRepo.updateOne(id, updates);
    if (_return) {
      Object.assign(region, updates);
      return region;
    }
  }

  // Find Region By Id
  async findOneById(id: string): Promise<Region> {
    return this.regionRepo.findOne({ where: { id } });
  }

  // DeleteOne Region
  deleteOne(findOpts: Partial<Region>): Promise<boolean> {
    return this.regionRepo.deleteOne(findOpts.id);
  }
}
