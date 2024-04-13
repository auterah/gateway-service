import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { MailTnxRepository } from './mail_tnx.repository';
import { Between, FindManyOptions } from 'typeorm';
import { DateUtils } from 'src/shared/utils/date';
import { HttpExceptionsHandler } from 'src/shared/handlers/http-exceptions.handler';
import MailTransaction from './entities/mail_transaction.entity';

@Injectable()
export class ReportService {
  private logger = new Logger(ReportService.name);

  constructor(private txnRepo: MailTnxRepository) {}

  findRecordsByAppId(appId: string, findOpts: FindDataRequestDto) {
    return this.txnRepo.findRecordsByAppId(appId, {
      skip: Number(findOpts.skip || '0'),
      take: Number(findOpts.take || '10'),
    });
  }

  findAllTransactionRecords(findOpts: FindDataRequestDto) {
    return this.txnRepo.findAllRecords({
      skip: Number(findOpts.skip || '0'),
      take: Number(findOpts.take || '10'),
    });
  }

  findSingleRecordByAppId(appId: string, tnxId: string) {
    return this.txnRepo.findSingleRecordByAppId(appId, tnxId);
  }

  fetchOverviewByAppId(appId: string, findOpts: FindDataRequestDto) {
    try {
      const isDateRange = findOpts.start_date && findOpts.end_date;
      const startDate =
        isDateRange && DateUtils.parseHyphenatedDate(findOpts.start_date);
      const endDate =
        isDateRange && DateUtils.parseHyphenatedDate(findOpts.end_date);
      const opts: FindManyOptions<MailTransaction> = {};
      const isInvalidDates = startDate || endDate;

      if (isDateRange && !isInvalidDates) {
        throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
      } else {
        opts.where = {
          createdAt: Between(new Date(startDate), new Date(endDate)),
        };
      }

      return this.txnRepo.fetchOverviewByAppId(appId, opts);
    } catch (e) {
      throw new HttpException(
        e?.message || 'Something went wrong',
        e?.status || HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
