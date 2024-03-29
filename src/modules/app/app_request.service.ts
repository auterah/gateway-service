import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AppRequestRepository } from './repositories/app_request.repository';
import AppRequest from './entities/app_request.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { OnEvent } from '@nestjs/event-emitter';
import { AppRequestEvents } from 'src/shared/events/app.events';

@Injectable()
export class AppRequestService {
  constructor(private readonly appReqRepo: AppRequestRepository) {}

  // Save request
  @OnEvent(AppRequestEvents.NEW_REQUEST)
  async saveAppRequest(newReq: AppRequest): Promise<AppRequest> {
    return this.appReqRepo.createRequest(newReq);
  }

  // Select Single Request
  findOne(findOpts: FindOneOptions<AppRequest>): Promise<AppRequest> {
    return this.appReqRepo.findOne(findOpts);
  }

  // Select All Requests
  selectAllRecords(
    findOpts: FindManyOptions<AppRequest>,
  ): Promise<PaginationData> {
    return this.appReqRepo.findAllRecords(findOpts);
  }
}
