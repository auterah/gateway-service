import * as nodemailer from 'nodemailer';
import { HttpException, Inject, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SmtpProviders } from 'src/shared/enums';
import { HBSProvider } from '../providers/handlebar.provider';
import {
  IEmailService,
  ISMTPConfigs,
  VerifyConn,
  MailOptions,
  SendMailResponse,
} from 'src/modules/email/interfaces';
import { MailEvents } from 'src/shared/events/mail.events';
import { EmailUtils } from 'src/shared/utils/email.utils';

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
    global.DATA_BASE_STATUS = false;
    this.connection()
  }

  @OnEvent(MailEvents.SET_SMTP)
  async connection(_configs?: ISMTPConfigs): Promise<void> {
    const configs: any = {}

    configs.host = 'smtp.gmail.com';
    configs.port = '587';
    configs.username = 'farmassite@gmail.com';
    configs.password = 'cwxpwmbfnxbihnnv';
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
      global.DATA_BASE_STATUS = true;
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
                message: `Error connecting to ${__this.smtpDomain} service! ❌❌❌❌❌`,
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
  sendMail(mail: MailOptions): Promise<SendMailResponse> {
    return new Promise(async (resolve, reject) => {
      let html;

      if (!this.transporter) {
        return reject({
          status: 'FAILED',
          message: `Error connecting to (${this.smtpDomain}) email provider`,
          ...mail,
        });
      }

      if (!(await EmailUtils.validateEmail(mail.to))) {
        return reject({
          status: 'FAILED',
          message: 'Invalid email address',
          ...mail,
        });
      }

      try {
        html = await this.templateEngine.compileTextToHBS(mail.html, mail.data);
      } catch (e) {
        return reject({
          status: 'FAILED',
          message: `${this.templateEngine.name} error: ${JSON.stringify(e)}`,
          ...mail,
        });
      }

      mail.html = html;
      // mail.from = `${mail.from} <${this.sender}>`;
      mail.from = `${mail.from} <noreply@crossriverpay.com>`;
      this.transporter.sendMail(mail, (e, info) => {
        if (e) {
          this.logger.error(e);
          return reject({
            status: 'FAILED',
            message: e,
            ...mail,
          });
        } else {
          this.logger.debug(`MessageID: ${info?.messageId}`);
          this.logger.log(`🚚✨ Email sent successfully =====> ${mail.to}`);
          return resolve({
            messageId: info?.messageId,
            status: 'SENT',
            ...mail,
          });
        }
      });
    });
  }
}
