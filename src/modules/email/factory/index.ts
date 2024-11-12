import { Injectable } from '@nestjs/common';
import { Nodemailer } from '../libs/mailers/nodemailer';
import { EmailProcessors } from 'src/shared/enums';
import { IEmailService } from '../interfaces';
import { ResendEmailService } from 'src/_providers/resend/resend.email.service';

/**
 * Factory class responsible for returning a collection of Email Processor classes
 */
@Injectable()
export class EmailProcessorFactory {
  emailProcessors: Map<EmailProcessors, IEmailService>;

  constructor(nodemailer: Nodemailer, resendEmailService: ResendEmailService) {
    if (!this.emailProcessors) {
      this.emailProcessors = new Map<EmailProcessors, IEmailService>();

      this.emailProcessors.set(EmailProcessors.NODE_MAILER, nodemailer);
      this.emailProcessors.set(EmailProcessors.RESEND, resendEmailService);
    }
  }

  /**
   * Returns all emailProcessors in a map
   */
  public all(): Map<EmailProcessors, IEmailService> {
    return this.emailProcessors;
  }

  /**
   * Returns a single emailProcessor
   */
  public findOne(provider: EmailProcessors): IEmailService {
    const emailProvider = this.emailProcessors.get(provider);

    if (!emailProvider) {
      throw new ReferenceError(`Provider not found in factory`);
    }

    return emailProvider;
  }
}
