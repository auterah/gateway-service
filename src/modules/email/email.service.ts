import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import App from '../app/entities/app.entity';
import { BootEvents } from 'src/shared/events/local.events';
import { EmailProcessorFactory } from './factory';
import { EmailProcessors } from 'src/shared/enums';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private adminApp: App;
  constructor(private mailer: EmailProcessorFactory) {}

  @OnEvent(BootEvents.ADMIN_APP_IS_SET)
  setupadminApp(adminApp: App) {
    this.adminApp = adminApp;
  }

  @OnEvent(MailEvents.PUSH_MAIL)
  async sendMail(data) {
    try {
      const mailer = this.mailer.findOne(EmailProcessors.NODE_MAILER);
      await mailer.sendMail(data);
      // await HttpRequestHandler.fetch({
      //   url: `${configs.Q_LOOP_QUEUE_HOST}/emails/send`,
      //   method: 'PATCH',
      //   data,
      //   headers: {
      //     'x-api-key': this.adminApp.publicKey,
      //   },
      // });
    } catch (e) {
      this.logger.error(`Error sending mail:`, JSON.stringify(e));
    }
  }
}
