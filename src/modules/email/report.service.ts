import { Injectable, Logger } from '@nestjs/common';
import { MailTnxRepository } from './repositories/mail_tnx.repository';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';

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

  findSingleRecordByAppId(appId: string, tnxId: string) {
    return this.txnRepo.findSingleRecordByAppId(appId, tnxId);
  }
}
