import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from './entities/mail_transaction.entity';
import { ReportService } from './services/report.service';
import { MailTnxRepository } from './repositories/mail_tnx.repository';
import { ApiReportController } from './controllers/api_report.controller';
import { ReportController } from './controllers/report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction])],
  controllers: [ReportController, ApiReportController],
  providers: [ReportService, MailTnxRepository],
})
export class ReportModule {}
