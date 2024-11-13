import { Injectable } from '@nestjs/common';
import { ResendService } from './resend.service';
import { IEmailService, MailOptions } from 'src/modules/email/interfaces';
import { EmailProcessors } from 'src/shared/enums';

@Injectable()
export class ResendEmailService extends ResendService implements IEmailService {
  isConnected: boolean | null;
  service: EmailProcessors = EmailProcessors.RESEND;
  async connection(credentials: any): Promise<void> {}

  async sendMail(sendmailOpts: MailOptions): Promise<void> {
    this._exe.emails
      .send({
        from: sendmailOpts.from,
        to: sendmailOpts.to,
        subject: sendmailOpts.subject,
        html: sendmailOpts.html,
      })
      .then(({ data }) => {
        this._logger.log(`🚚✨ Email sent successfully =====> ${data?.id}`);
      })
      .catch((e) => {
        this._logger.error(e);
      });
  }
}
