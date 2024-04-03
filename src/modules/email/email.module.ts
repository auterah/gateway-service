import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MailTnxRepository } from './repositories/mail_tnx.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from './entities/mail_transaction.entity';
import Email from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction, Email])],
  providers: [EmailService, ReportService, MailTnxRepository],
  controllers: [ReportController],
})
export class EmailModule {}
