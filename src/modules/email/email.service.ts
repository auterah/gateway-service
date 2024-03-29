import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import { HttpRequestHandler } from 'src/shared/handlers/http-request.handler';

@Injectable()
export class EmailService {
  @OnEvent(MailEvents.PUSH_MAIL)
  async sendMail(data) {
    await HttpRequestHandler.fetch({
      url: `${configs.Q_LOOP_QUEUE_HOST}/emails/send`,
      method: 'PATCH',
      data,
      headers: {
        'x-api-key': configs.Q_LOOP_PUBLIC_KEY,
      },
    });
  }
}
