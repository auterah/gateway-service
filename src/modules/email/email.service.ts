import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import { HttpRequestHandler } from 'src/shared/handlers/http-request.handler';
import App from '../app/entities/app.entity';
import { BootEvents } from 'src/shared/events/local.events';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private adminApp: App;

  @OnEvent(BootEvents.CREATED_ADMIN_APP)
  setupadminApp(adminApp: App) {
    this.adminApp = adminApp;
  }

  @OnEvent(MailEvents.PUSH_MAIL)
  async sendMail(data) {
    try {
      await HttpRequestHandler.fetch({
        url: `${configs.Q_LOOP_QUEUE_HOST}/emails/send`,
        method: 'PATCH',
        data,
        headers: {
          'x-api-key': this.adminApp.publicKey,
        },
      });
    } catch (e) {
      this.logger.error(`Error sending mail:`, JSON.stringify(e));
    }
  }
}
