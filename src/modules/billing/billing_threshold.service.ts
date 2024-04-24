import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { FindOneOptions } from 'typeorm';
import { BillingThresholdRepository } from './repositories/billing_threshold.repository';
import BillingThreshold from './entities/billing_threshold.entity';
import {
  BillingThresholdDto,
  ManyBillingThresholdDto,
} from './dtos/billing_threshold.dto';

@Injectable()
export class BillingThresholdService {
  private logger = new Logger(BillingThresholdService.name);

  constructor(
    protected readonly threshRepo: BillingThresholdRepository,
    protected readonly threshEvent: EventEmitter2,
  ) {}

  private async addThresholdErrorHandling(inThresh: BillingThresholdDto) {
    try {
      const found = await this.threshRepo.findByNameORCostORThreshold(inThresh);
      if (found) {
        let discriminator = '';

        if (found.name == inThresh.name) {
          discriminator += 'Name';
        }

        if (found.cost == inThresh.cost) {
          discriminator += ' Cost';
        }

        if (found.threshold == inThresh.threshold) {
          discriminator += ' Threshold';
        }

        discriminator = `${
          discriminator.split(' ').length > 1
            ? discriminator.replace(/ /g, ' & ')
            : discriminator
        } already exist`.trim();

        return discriminator[0] == '&'
          ? discriminator.slice(2, discriminator.length)
          : discriminator;
      }
      return null;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async addThreshold(inThresh: BillingThresholdDto): Promise<BillingThreshold> {
    try {
      const error = await this.addThresholdErrorHandling(inThresh);
      if (error) {
        throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
      }
      return this.threshRepo.addThreshold(inThresh);
    } catch (e) {
      throw new HttpException(e?.message || e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async addBulkThresholds(
    inThreshs: ManyBillingThresholdDto,
  ): Promise<BillingThreshold[]> {
    try {
      type E = { name: string; error: string };
      const errors: E[] = [];
      const thresholds = [];

      for (const inTh of inThreshs.thresholds) {
        // Check for errors
        const error = await this.addThresholdErrorHandling(inTh);
        errors.push({ name: inTh.name, error });
      }

      if (errors.length && !errors.filter((e) => !e.error).length) {
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }

      for (const inTh of inThreshs.thresholds) {
        // Add new Thresholds
        const newTh = this.threshRepo.repo.create(inTh);
        thresholds.push(newTh);
      }
      return this.threshRepo.repo.save(thresholds);
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  findByName(name: string): Promise<BillingThreshold> {
    return this.threshRepo.findOne({ where: { name } });
  }

  findAllRecords(queries: FindDataRequestDto): Promise<PaginationData> {
    return this.threshRepo.findAllRecords({
      take: +queries.take,
      skip: +queries.skip,
    });
  }

  findOneBillingPlan(
    findOpts: FindOneOptions<BillingThreshold>,
  ): Promise<BillingThreshold> {
    return this.threshRepo.findOne(findOpts);
  }
}
