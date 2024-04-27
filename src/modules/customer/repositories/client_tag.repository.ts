import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteOptions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientTagEvents } from 'src/shared/events/client.events';
import ClientTag from '../entities/client_tag.entity';
import { ClientTagDto } from '../dtos/client_tag.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { StatsResponse } from 'src/shared/types/response';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { format } from 'date-fns';

@Injectable()
export class ClientTagRepository {
  private logger = new Logger(ClientTagRepository.name);
  constructor(
    @InjectRepository(ClientTag)
    private readonly tagEntity: Repository<ClientTag>,
    public tagEvent: EventEmitter2,
  ) {}

  // Add New Tag
  async create(tagDto: Partial<ClientTagDto>): Promise<ClientTag> {
    const exist = await this.findOne({
      where: { name: tagDto.name, customerId: tagDto.customerId },
    });
    if (exist) {
      throw new HttpException('Tag already exist', HttpStatus.NOT_ACCEPTABLE);
    }
    const newTag = this.tagEntity.create(tagDto);
    const tag = await this.tagEntity.save(newTag);
    this.tagEvent.emit(ClientTagEvents.CREATED, tag);
    delete tag.customer;
    return tag;
  }

  // FindOne Tag
  findOne(findOpts: FindOneOptions<ClientTag>): Promise<ClientTag> {
    return this.tagEntity.findOne(findOpts);
  }

  // Fetch All Tags
  async findAllRecords(
    findOpts: FindManyOptions<ClientTag>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.tagEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Update Tag By Id
  async updateOneById(
    customerId: string,
    id: string,
    updates: Partial<ClientTag>,
    _return = false,
  ): Promise<void | ClientTag> {
    const tag = await this.findOne({
      where: { id, customerId },
    });

    if (!tag) {
      throw new HttpException('Invalid Tag', HttpStatus.EXPECTATION_FAILED);
    }

    if (updates.name && tag.name == updates.name) {
      throw new HttpException(
        'Try another name. Tag name already exist',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const findOpt = { id, customerId };

    if (!_return) {
      await this.tagEntity.update(findOpt, updates);
      return;
    }
    await this.tagEntity.update(findOpt, updates);
    return this.findOne({ where: findOpt });
  }

  // Delete Tag
  async deleteOne(clientTag: Partial<ClientTag>): Promise<boolean> {
    const tag = await this.findOne({
      where: { id: clientTag.id, customerId: clientTag.customerId },
    });
    if (!tag) {
      throw new HttpException('Invalid Tag', HttpStatus.EXPECTATION_FAILED);
    }
    await this.tagEntity.remove(tag);
    return true;
  }

  // Count Tags Records
  async countTagsRecords(customerId: string): Promise<StatsResponse> {
    let tags = await this.tagEntity
      .createQueryBuilder('client_tags')
      .select('name', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('customer_id = :customerId', { customerId })
      .groupBy('client_tags.name')
      .getRawMany();

    const totalCount = tags.reduce(
      (acc, curr) => acc + Number(curr.count || '0'),
      0,
    );
    tags = tags.map((e) => e?.tag);
    return { tags, totalCount };
  }

  get repo(): Repository<ClientTag> {
    return this.tagEntity;
  }
}
