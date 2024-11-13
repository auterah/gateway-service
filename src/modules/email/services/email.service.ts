import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import { BootEvents } from 'src/shared/events/local.events';
import { EmailProcessors } from 'src/shared/enums';
import { CustomerEvents } from 'src/shared/events/customer.events';
import { AdminEvents } from 'src/shared/events/admin.events';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { SmtpDto } from 'src/dtos/smtp.dto';
import App from 'src/modules/app/entities/app.entity';
import Customer from 'src/modules/customer/entities/customer.entity';
import { EmailProcessorFactory } from '../factory';
import { IEmailService, ISMTPConfigs, MailOptions } from '../interfaces';
import { EmailRepository } from '../repositories/email.repository';
import { SmtpRepository } from '../repositories/smtp.repository';
import Admin from 'src/modules/admin/admin.entity';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private adminApp: App;
  private mailer: IEmailService;
  private _useDefaultMailer: boolean = false;
  constructor(
    private factory: EmailProcessorFactory,
    private smtpRepo: SmtpRepository,
    private emailRepo: EmailRepository,
  ) {
    this.mailer = this.factory.findOne(EmailProcessors.RESEND);
    this.logger.verbose(`${this.mailer.service} service`);
  }

  async connect(credentials: ISMTPConfigs) {
    try {
      await this.mailer.connection(credentials);
      if (!credentials) {
        this._useDefaultMailer = true;
      }
    } catch (error) {
      throw error;
    }
  }

  @OnEvent(BootEvents.ADMIN_APP_IS_SET)
  setupadminApp(adminApp: App) {
    this.adminApp = adminApp;
  }

  @OnEvent(MailEvents.PUSH_MAIL)
  async sendMail(data) {
    try {
      await this.mailer.sendMail({
        ...data,
        from: 'noreply@sendpouch.cloud',
      });
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

  findSmtpByAppId(appId: string) {
    return this.smtpRepo.findOne({
      where: { appId },
    });
  }

  async addSMTP(app: App, newSmtp: SmtpDto) {
    const _app = await this.smtpRepo.addSMTP(app, {
      user: newSmtp.username,
      host: newSmtp.host,
      password: newSmtp.password,
      port: newSmtp.port,
      appId: app.id,
      app,
    });
    delete _app.app;
    return _app;
  }

  fetchAllSmtp(findOpts: FindDataRequestDto) {
    return this.smtpRepo.findAllRecords({
      skip: Number(findOpts.skip || '0'),
      take: Number(findOpts.take || '10'),
    });
  }
}
