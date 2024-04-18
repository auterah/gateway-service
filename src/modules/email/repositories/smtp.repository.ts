import { Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import Smtp from '../entities/smtp.entity';
import App from 'src/modules/app/entities/app.entity';

@Injectable()
export class SmtpRepository {
  constructor(
    @InjectRepository(Smtp)
    private readonly smtpEntity: Repository<Smtp>,
  ) {}

  // Add SMTP
  addSMTP(app: App, inSmtp: Partial<Smtp>) {
    const newSmtp = this.smtpEntity.create({
      ...inSmtp,
      app,
      appId: app.id,
    });
    return this.smtpEntity.save(newSmtp);
  }

  // Find One
  findOne(findOpts: FindOneOptions<Smtp>): Promise<Smtp> {
    return this.smtpEntity.findOne(findOpts);
  }

  // Find All Smtps
  async findAllRecords(
    findOpts: FindManyOptions<Smtp>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const mails = await this.smtpEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(mails, skip, take);
  }
}
