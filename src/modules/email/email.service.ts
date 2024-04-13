import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import App from '../app/entities/app.entity';
import { BootEvents } from 'src/shared/events/local.events';
import { EmailProcessorFactory } from './factory';
import { EmailProcessors } from 'src/shared/enums';
import { IEmailService, MailOptions } from './interfaces';
import Customer from '../customer/customer.entity';
import { CustomerEvents } from 'src/shared/events/customer.events';
import { AdminEvents } from 'src/shared/events/admin.events';
import Admin from '../admin/admin.entity';

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

  @OnEvent(CustomerEvents.CREATED)
  async welcomeCustomer(customer: Customer) {
    try {
      const mail: MailOptions = {
        to: customer.email,
        html: `
          <h2>Hi ${customer.businessName}, welcome! Your app is ready</h2>`,
        subject: `Welcome to ${configs.COMPANY_NAME}`,
      };
      await this.mailer.sendMail(mail);
    } catch (e) {
      this.logger.error(
        `Error sending customer welcome mail:`,
        JSON.stringify(e),
      );
    }
  }

  @OnEvent(AdminEvents.SUPER_ADMIN_CREATED)
  async welcomeSuperadmin({ admin, app }: { admin: Admin; app: App }) {
    try {
      const mail: MailOptions = {
        html: `Welcome! Here is your app credentials: 
          <br>
          <b>otp:</b> ${admin.otp} 
          <br>
          <b>password:</b> ${admin.password}
          <br>
          <b>name:</b> ${app.name} 
          <br>
          <b>public_key:</b> ${app.publicKey}
          `,
        subject: 'Your app is setup 🏁',
        to: admin.email,
      };
      await this.mailer.sendMail(mail);
    } catch (e) {
      this.logger.error(
        `Error sending superadmin welcome mail:`,
        JSON.stringify(e),
      );
    }
  }
}
