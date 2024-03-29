import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AppRequest from '../entities/app_request.entity';
import { PaginationData } from 'src/shared/types/pagination';

@Injectable()
export class AppRequestRepository {
  constructor(
    @InjectRepository(AppRequest)
    private readonly appReqEntity: Repository<AppRequest>,
  ) {}

  // Create app request
  createRequest(newInput: Partial<AppRequest>): Promise<AppRequest> {
    const newReq = this.appReqEntity.create(newInput);
    return this.appReqEntity.save(newReq);
  }

  // Find Single Request
  findOne(findOpts: FindOneOptions<AppRequest>): Promise<AppRequest> {
    return this.appReqEntity.findOne(findOpts);
  }

  // Find All Apps Requests
  async findAllRecords(
    findOpts: FindManyOptions<AppRequest>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const apps = await this.appReqEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(apps, skip, take);
  }
}
