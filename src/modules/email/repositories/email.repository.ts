import { Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import MailTransaction from '../../report/entities/mail_transaction.entity';
import Email from '../entities/email.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { TemplateDto } from '../dtos/template.dto';

@Injectable()
export class EmailRepository {
  constructor(
    @InjectRepository(MailTransaction)
    private readonly emailEntity: Repository<Email>,
    private readonly emailEvents: EventEmitter2,
  ) {}

  // Create Email
  create(tempDto: TemplateDto): Promise<Email> {
    const newEmail = this.emailEntity.create(tempDto);
    return this.emailEntity.save(newEmail);
  }

  // Find Single Mail
  findOne(findOpts: FindOneOptions<Email>): Promise<Email> {
    return this.emailEntity.findOne(findOpts);
  }

  // Find All Mails
  async findAllRecords(
    findOpts: FindManyOptions<Email>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const mails = await this.emailEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(mails, skip, take);
  }
}
