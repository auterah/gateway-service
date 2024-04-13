import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from '../report/entities/mail_transaction.entity';
import Email from './entities/email.entity';
import { EmailProcessorFactory } from './factory';
import { Nodemailer } from './libs/mailers/nodemailer';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction, Email])],
  providers: [EmailService, EmailProcessorFactory, Nodemailer],
})
export class EmailModule {}
