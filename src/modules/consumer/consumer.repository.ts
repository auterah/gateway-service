import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Consumer from './consumer.entity';
import { ConsumerDto } from './dtos/consumer.dto';
import { ConsumerEvents } from 'src/shared/events/consumer.events';
import { PaginationData } from 'src/shared/types/pagination';

@Injectable()
export class ConsumerRepository {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepo: Repository<Consumer>,
    public customerEvent: EventEmitter2,
  ) {}

  // Add New Consumer
  async create(consumerDto?: Partial<ConsumerDto>): Promise<Consumer> {
    const consumer = await this.findOne({
      where: { email: consumerDto.email },
    });
    if (consumer) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const newConsumer = this.consumerRepo.create(consumerDto);
    const _consumer = await this.consumerRepo.save(newConsumer);
    this.customerEvent.emit(ConsumerEvents.CREATED, _consumer);
    return _consumer;
  }

  async findOrCreate(consumerDto: Partial<ConsumerDto>): Promise<Consumer> {
    const consumer = await this.findOne({
      where: { email: consumerDto.email },
    });
    if (consumer) {
      return consumer;
    }
    return this.create(consumerDto);
  }

  // Find Consumer
  findOne(findOpts: FindOneOptions<Consumer>): Promise<Consumer> {
    return this.consumerRepo.findOne(findOpts);
  }

  // Fetch All Consumer
  async findAllRecords(
    findOpts: FindManyOptions<Consumer>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.consumerRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Update Consumer By Id
  updateOneById(id: string, updates: Partial<Consumer>): Promise<any> {
    return this.consumerRepo.update({ id }, updates);
  }

  get repo(): Repository<Consumer> {
    return this.consumerRepo;
  }
}
