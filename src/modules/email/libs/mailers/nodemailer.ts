import * as nodemailer from 'nodemailer';
import { HttpException, Inject, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EmailProcessors, SmtpProviders } from 'src/shared/enums';
import { HBSProvider } from '../providers/handlebar.provider';
import * as Email from 'email-templates';

import {
  IEmailService,
  ISMTPConfigs,
  VerifyConn,
  MailOptions,
  SendMailResponse,
} from 'src/modules/email/interfaces';
import { MailEvents } from 'src/shared/events/mail.events';
import { EmailUtils } from 'src/shared/utils/email.utils';
import { configs as _configs } from 'config/config.env';

type NodemailerConfig = {
  service: string;
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
};

export class Nodemailer implements IEmailService {
  isConnected = null;
  service: EmailProcessors = EmailProcessors.NODE_MAILER;
  private transporter: any;
  private smtpDomain = 'Unrecognized';
  private sender: string;
  private retry = 0;
  private retryAt = 2000; // Time to try re-connection (Default = 2sec)
  private smtpConfigs: NodemailerConfig;
  private readonly logger: Logger;

  private templateEngine: HBSProvider;

  constructor(private event: EventEmitter2) {
    this.logger = new Logger(Nodemailer.name);
    this.templateEngine = new HBSProvider();
    global.EMAIL_SERVER_RUNNING = false;
  }

  @OnEvent(MailEvents.SET_SMTP)
  async connection(configs: ISMTPConfigs): Promise<void> {
    this.sender = `<${configs.username}>`;
    this.smtpDomain = EmailUtils.getSmtpDomain(configs.host);

    this.smtpConfigs = {
      service: this.smtpDomain,
      host: configs.host,
      port: Number(configs.port),
      auth: {
        user: configs.username,
        pass: configs.password,
      },
    };

    if (this.smtpDomain === SmtpProviders.OFFICE365) {
      this.smtpConfigs = _.omit(this.smtpConfigs, 'service');
    }

    this.logger.debug(
      `${this.retry ? `Re-connecting(${this.retry})` : 'Connecting'} to ${
        this.smtpDomain
      } service...`,
    );

    this.transporter = nodemailer.createTransport(this.smtpConfigs);

    try {
      const { message, status } = await this.verifyConnection();
      this.logger[status ? 'log' : 'error'](message);
      this.isConnected = status;
      this.retry++;
      setTimeout(() => {
        if (!status) this.connection(configs);
      }, this.retryAt);
      global.EMAIL_SERVER_RUNNING = true;
    } catch (error) {
      this.logger.error('connectionError');
    }
  }

  async verifyConnection(): Promise<VerifyConn> {
    const __this = this;
    if (!__this.transporter) {
      throw new Error('Error connecting to email provider');
    }
    return new Promise<VerifyConn>((resolve, _) => {
      __this.transporter.verify(function (e, success) {
        if (!e) __this.retry = 0;
        resolve(
          e
            ? {
                status: false,
                message: JSON.stringify({
                  message: `Error connecting to ${__this.smtpDomain} service! ❌❌❌❌❌`,
                  reason: e?.response,
                }),
              }
            : {
                status: true,
                message: `${__this.smtpDomain.toUpperCase()} service is ready to take messages 🚀🚀🚀🚀🚀🚀`,
              },
        );
      });
    });
  }

  @OnEvent(MailEvents.SEND_MAIL)
  async sendMail(inputs: MailOptions): Promise<void> {
    const logger = this.logger;
    if (!this.transporter) {
      throw new Error('Error connecting to email provider');
    }

    const email = new Email({
      preview: false,
      message: {
        from: this.sender,
      },
      send: true,
      transport: this.transporter,
    });

    inputs.html = await this.templateEngine.compileTextToHBS(
      inputs.html,
      inputs.data,
    );

    email
      .send({
        message: {
          to: inputs.to,
          subject: inputs.subject,
          html: inputs.html,
          text: inputs.subText || inputs.subject,
        },
      })
      .then((info) => {
        logger.log(`🚚✨ Email sent successfully =====> ${inputs.to}`);
      })
      .catch((e) => {
        logger.error(e);
      });
  }
}
