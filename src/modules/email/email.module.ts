import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MailTransaction from '../report/entities/mail_transaction.entity';
import Email from './entities/email.entity';
import { EmailProcessorFactory } from './factory';
import { Nodemailer } from './libs/mailers/nodemailer';
import { SmtpRepository } from './repositories/smtp.repository';
import Smtp from './entities/smtp.entity';
import { EmailRepository } from './repositories/email.repository';
import { TemplateController } from './controllers/template.controller';
import { TemplateService } from './services/template.service';
import Template from './entities/template.entity';
import { TemplateRepository } from './repositories/template.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MailTransaction, Email, Smtp, Template])],
  providers: [
    EmailService,
    EmailProcessorFactory,
    Nodemailer,
    SmtpRepository,
    EmailRepository,
    TemplateService,
    TemplateRepository,
  ],
  exports: [EmailService],
  controllers: [TemplateController],
})
export class EmailModule {}
