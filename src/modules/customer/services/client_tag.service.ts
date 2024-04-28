import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository, Between } from 'typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientTagRepository } from '../repositories/client_tag.repository';
import ClientTag from '../entities/client_tag.entity';
import { BulkClientTagDto, ClientTagDto } from '../dtos/client_tag.dto';
import { ClientTagUtils } from '../utils/client';
import { CustomerService } from './customer.service';
import { CryptoUtil } from 'src/shared/utils/crypto';
import { StatsResponse } from 'src/shared/types/response';
import Customer from '../entities/customer.entity';
import { DateUtils } from 'src/shared/utils/date';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';


@Injectable()
export class ClientTagService {
  constructor(
    private readonly tagRepo: ClientTagRepository,
    private readonly customerService: CustomerService,
  ) {}

  // Add New Tag
  addTag(tagDto: ClientTagDto): Promise<ClientTag> {
    return this.tagRepo.create(tagDto);
  }

  // Add Bulk Tags
  async addBulkTags(
    customerId: string,
    clientDto: BulkClientTagDto,
  ): Promise<ClientTag[]> {
    try {
      const customer = await this.customerService.findOneById(customerId);

      const newTags: ClientTag[] = [];
      const _tags = ClientTagUtils.removeDuplicatesByName(clientDto.tags);

      type E = { error: string; tag: ClientTag };
      const errors: E[] = [];

      const records: ClientTag[] = (await this.findAllRecords(customerId, {}))
        .records;
      for (const tag of _tags) {
        if (records.find((e: ClientTag) => e.name == tag.name)) {
          errors.push({
            error: 'Tag already exist',
            tag,
          });
        }
        tag.customer = customer;
        tag.customerId = customer.id;
        newTags.push(tag);
      }

      if (errors.length) {
        for (const err of errors) {
          delete err.tag.customer;
        }
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }

      const tags = await this.tagRepo.repo.save(_tags);
      for (const tag of tags) {
        delete tag.customer;
      }
      return tags;
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  // FindOne Tag
  protected findOne(findOpts: FindOneOptions<ClientTag>): Promise<ClientTag> {
    return this.tagRepo.findOne(findOpts);
  }

  // FindOne Tag By Id
  findOneById(customerId: string, id: string): Promise<ClientTag> {
    return this.tagRepo.findOneById(customerId, id);
  }

  // Find Tag By Name
  findOneByName(customerId: string, name: string): Promise<ClientTag> {
    return this.tagRepo.findOneByName(customerId, name);
  }

  // Fetch All Tag
  findAllRecords(
    customerId: string,
    { where, ...findOpts }: FindManyOptions<ClientTag>,
  ): Promise<PaginationData> {
    return this.tagRepo.findAllRecords({
      where: { customerId },
      ...findOpts,
    });
  }

  // Delete Tag
  protected _deleteTag(tag: Partial<ClientTag>): Promise<boolean> {
    return this.tagRepo.deleteOne({
      id: tag.id,
      customerId: tag.customerId,
    });
  }

  // Delete Tag
  deleteTagById(customerId: string, id: string): Promise<boolean> {
    return this._deleteTag({
      id,
      customerId,
    });
  }

  // Update Tag
  updateClientTag(
    customerId: string,
    id: string,
    updates: Partial<ClientTagDto>,
  ): Promise<void | ClientTag> {
    return this.tagRepo.updateOneById(customerId, id, updates, true);
  }

  // Find All Tag By Admin
  findTagsByAdmin(
    findOpts: FindManyOptions<ClientTag>,
  ): Promise<PaginationData> {
    return this.tagRepo.findAllRecords(findOpts);
  }

  // Fetch Tag Stats
  fetchTagsStats(customer: Customer): Promise<StatsResponse> {
    return this.tagRepo.countTagsRecords(customer.id);
  }

  findTagsByIds(customerId: string, tagIds: string[], vetRecords: boolean) {
    return this.tagRepo.findTagsByIds(customerId, tagIds, vetRecords);
  }

  deleteMany(customerId: string, tagIds: string[]) {
    return this.tagRepo.deleteMany(customerId, tagIds);
  }
}
