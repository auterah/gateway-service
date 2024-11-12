import { EmailProcessors, MQTT_TOPICS } from 'src/shared/enums';
import { EMailTransactionStatus } from '../enums/mail_transaction_status';

type MailProvider = 'gmail' | 'office365';
export default interface IMailerConfig {
  username: string;
  password: string;
  provider: MailProvider;
}

export type MailOptions = {
  from?: string;
  to: string;
  text?: string;
  html?: string;
  templateName?: string;
  subText?: string;
  subject: string;
  source?: string;
  data?: { [key: string]: any };
  refId?: number;
};

export type MQTTPayload = {
  topic: string;
  message: string;
};

export type MailContentTypes = 'text/plain' | 'application/pdf' | 'image/gif';
export type MqttMailPayload = { email: string; data: any };

export interface MailAttachment {
  encoding: 'base64';
  filename: string;
  content: string; // base64 value
  contentType: MailContentTypes;
}

type MailTransactionKeys = keyof typeof EMailTransactionStatus;

export type SendMailResponse = {
  messageId?: string;
  // email: string;
  status: MailTransactionKeys;
} & MailOptions;

export interface IEmailService {
  service: EmailProcessors;
  isConnected: boolean | null;
  connection(credentials: any): Promise<void>;
  sendMail(inputs: MailOptions): Promise<void>;
}

export type MQTTTopics = keyof typeof MQTT_TOPICS;
export type MailPayload = {
  email: string;
  html: string;
  subject: string;
  subText?: string;
};

export interface ISMTPConfigs {
  host: string;
  port: string;
  username: string;
  password: string;
  provider?: string;
}

export type VerifyConn = {
  status: boolean;
  message: string;
};
