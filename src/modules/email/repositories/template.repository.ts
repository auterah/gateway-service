import { Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import Template from '../entities/template.entity';
import { TemplateDto } from '../dtos/template.dto';

@Injectable()
export class TemplateRepository {
  constructor(
    @InjectRepository(Template)
    private readonly templateEntity: Repository<Template>,
    private readonly templateEvents: EventEmitter2,
  ) {}

  // Create Template
  create(tempDto: TemplateDto): Promise<Template> {
    const newEmail = this.templateEntity.create(tempDto);
    return this.templateEntity.save(newEmail);
  }

  // Find Single Template
  findOne(findOpts: FindOneOptions<Template>): Promise<Template> {
    return this.templateEntity.findOne(findOpts);
  }

  // Find All Templates
  async findAllRecords(
    customerId: string,
    findOpts: FindManyOptions<Template>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.templateEntity.findAndCount({
      where: {
        customerId,
        ...findOpts.where,
      },
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }
}
