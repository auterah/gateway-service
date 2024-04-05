import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import App from '../app/entities/app.entity';
import { BootEvents } from 'src/shared/events/local.events';
import { EmailProcessorFactory } from './factory';
import { EmailProcessors } from 'src/shared/enums';
import { Nodemailer } from './libs/mailers/nodemailer';
import { IEmailService } from './interfaces';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private adminApp: App;
  private mailer: IEmailService;
  constructor(private factory: EmailProcessorFactory) {
    this.mailer = this.factory.findOne(EmailProcessors.NODE_MAILER);
  }

  @OnEvent(BootEvents.ADMIN_APP_IS_SET)
  setupadminApp(adminApp: App) {
    this.adminApp = adminApp;
  }

  @OnEvent(MailEvents.PUSH_MAIL)
  async sendMail(data) {
    try {
      await this.mailer.sendMail(data);
    } catch (e) {
      this.logger.error(`Error sending mail:`, JSON.stringify(e));
    }
  }
}
