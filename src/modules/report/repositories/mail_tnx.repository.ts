import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import { format } from 'date-fns';
import { EMailTransactionStatus } from 'src/modules/email/enums/mail_transaction_status';
import MailTransaction from '../entities/mail_transaction.entity';
@Injectable()
export class MailTnxRepository {
  constructor(
    @InjectRepository(MailTransaction)
    private readonly mailTnxEntity: Repository<MailTransaction>,
    private readonly mailEvents: EventEmitter2,
  ) {}

  // Find Single Tnx
  findOne(findOpts: FindOneOptions<MailTransaction>): Promise<MailTransaction> {
    return this.mailTnxEntity.findOne(findOpts);
  }

  // Find All Tnx
  async findAllRecords(
    findOpts: FindManyOptions<MailTransaction>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.mailTnxEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Find All Tnxs by App
  async findRecordsByAppId(
    appId: string,
    findOpts: Omit<FindManyOptions<MailTransaction>, 'where'>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.mailTnxEntity.findAndCount({
      where: {
        appId,
      },
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Find Single Tnxs by App
  findSingleRecordByAppId(
    appId: string,
    tnxId: string,
  ): Promise<MailTransaction> {
    return this.mailTnxEntity.findOne({
      where: { appId, id: tnxId },
    });
  }

  // Fetch overview
  async fetchOverview(findOpts: FindManyOptions<MailTransaction>) {
    const overview = {
      clicks: 0,
      opened: 0,
      sent: 0,
      failed: 0,
      bounced: 0,
    };

    const records = await this.mailTnxEntity.find(findOpts);
    records.forEach((rec) => {
      if (rec.status == EMailTransactionStatus.SENT) {
        overview.sent += 1;
      }
      if (rec.status == EMailTransactionStatus.FAILED) {
        overview.failed += 1;
      }
      if (rec.opened) {
        overview.opened += 1;
      }
      if (rec.bounced) {
        overview.bounced += 1;
      }
    });

    return overview;
  }

  async fetchStatistics(findOpts) {
    const months = [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    const { appId } = findOpts.where;

    const monthlyStatistics = await Promise.all(
      months.map(async (month) => {
        const startDate = new Date(2024, months.indexOf(month), 1);
        const endDate = new Date(2024, months.indexOf(month) + 1, 0);

        const statistics = await this.mailTnxEntity
          .createQueryBuilder('mail_transactions')
          .select(
            'SUM(CASE WHEN mail_transactions.status = :sent THEN 1 ELSE 0 END)',
            'sent',
          )
          .addSelect(
            'SUM(CASE WHEN mail_transactions.status = :failed THEN 1 ELSE 0 END)',
            'failed',
          )
          .addSelect('SUM(mail_transactions.clicks)', 'clicks')
          .addSelect('SUM(mail_transactions.opened)', 'opened')
          .addSelect('SUM(mail_transactions.bounced)', 'bounced')
          .where('mail_transactions.createdAt >= :startDate', {
            startDate: format(startDate, 'yyyy-MM-dd'),
          })
          .andWhere('mail_transactions.createdAt <= :endDate', {
            endDate: format(endDate, 'yyyy-MM-dd'),
          })
          .andWhere('mail_transactions.appId = :appId', { appId })
          .setParameter('sent', 'sent')
          .setParameter('failed', 'failed')
          .getRawOne();

        return { month, statistics };
      }),
    );

    return monthlyStatistics;
  }
}
