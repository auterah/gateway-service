import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from './entities/mail_transaction.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MailTnxRepository } from './mail_tnx.repository';
import { ApiReportController } from './api_report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction])],
  controllers: [ReportController, ApiReportController],
  providers: [ReportService, MailTnxRepository],
})
export class ReportModule {}
