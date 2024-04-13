import { Injectable, Logger } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { MailTnxRepository } from './mail_tnx.repository';

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
}
