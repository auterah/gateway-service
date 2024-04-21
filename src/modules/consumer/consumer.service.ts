import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { ConsumerRepository } from './consumer.repository';
import Consumer from './consumer.entity';
import { BulkConsumerDto, ConsumerDto } from './dtos/consumer.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { ConsumerUtils } from './utils/consumer';

@Injectable()
export class ConsumerService {
  constructor(private readonly consumerRepo: ConsumerRepository) {}

  // Add New Consumer
  async addConsumer(consumerDto: ConsumerDto): Promise<Consumer> {
    const exist = await this.findOneByEmail(consumerDto.email);
    if (exist) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.consumerRepo.create(consumerDto);
  }

  // Add Bulk Consumers
  async addBulkConsumers({ consumers }: BulkConsumerDto): Promise<Consumer[]> {
    try {
      const newConsumers: Consumer[] = [];
      const _consumers = ConsumerUtils.removeDuplicatesByEmail(consumers);

      type E = { error: string; consumer: Consumer };
      const errors: E[] = [];

      const records: Consumer[] = (await this.findAllRecords({})).records;
      for (const consumer of _consumers) {
        if (records.find((e: Consumer) => e.email == consumer.email)) {
          errors.push({
            error: 'Email already exist',
            consumer,
          });
        }
        newConsumers.push(consumer);
      }

      if (errors.length) {
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }

      return this.repo.save(ConsumerUtils.removeDuplicatesByEmail(_consumers));
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  // Find One Consumer
  findOne(findOpts: FindOneOptions<Consumer>): Promise<Consumer> {
    return this.consumerRepo.findOne(findOpts);
  }

  // Find Consumer By Email
  findOneByEmail(email: string): Promise<Consumer> {
    return this.findOne({
      where: { email },
    });
  }

  // Fetch All Consumers
  findAllRecords(findOpts: FindManyOptions<Consumer>): Promise<PaginationData> {
    return this.consumerRepo.findAllRecords(findOpts);
  }

  // Update Consumer By id
  async updateOneById(id: string, updates: Partial<Consumer>): Promise<any> {
    const update = await this.consumerRepo.updateOneById(id, updates);
    return update;
  }

  get repo(): Repository<Consumer> {
    return this.consumerRepo.repo;
  }
}
