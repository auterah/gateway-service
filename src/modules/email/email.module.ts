import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from '../report/entities/mail_transaction.entity';
import Email from './entities/email.entity';
import { EmailProcessorFactory } from './factory';
import { Nodemailer } from './libs/mailers/nodemailer';
import { SmtpRepository } from './repositories/smtp.repository';
import Smtp from './entities/smtp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction, Email, Smtp])],
  providers: [EmailService, EmailProcessorFactory, Nodemailer, SmtpRepository],
  exports: [EmailService],
})
export class EmailModule {}
