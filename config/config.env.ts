import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';
import { plainToClass } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { EmailUtils } from 'src/shared/utils/email.utils';
import { MailerCredentials } from 'src/shared/types/mailer';

const logger = new Logger('EnvConfig');
const NODE_ENVS = ['development', 'production', 'staging', 'test'] as const;
type NODE_ENV = (typeof NODE_ENVS)[number];

class EnvConfig {
  @IsIn(NODE_ENVS)
  NODE_ENV: NODE_ENV = 'development';

  // NUGI EAAS DATABASE
  @IsString()
  DATABASE_DIALECT: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  USE_DATABASE_LOG: boolean = true;

  // SERVER
  @IsString()
  SERVER_NAME: string;

  @IsNumber()
  SERVER_PORT: number;

  // OWNER
  @IsString()
  COMPANY_NAME: string;

  @IsString()
  @IsOptional()
  COMPANY_PHONE: string;

  @IsString()
  COMPANY_EMAIL: string;

  @IsString()
  ENCRYPTION_PRIVATE_KEY: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  API_VERSION: string;

  @IsBoolean()
  SYNC_SEEDERS: boolean = false;

  @IsString()
  REDIS_CONNECTION_URL: string;

  @IsString()
  Q_LOOP_QUEUE_HOST: string;

  @IsString()
  SUPER_ADMIN_EMAIL: string;

  @IsString()
  CUSTOMER_DEFAULT_PHOTO_URL: string;

  @IsString()
  RESEND_API_KEY: string;

  @IsObject()
  MAILER_CREDENTIALS: MailerCredentials;

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();

    // NUGI EAAS DATABASE
    (obj.DATABASE_DIALECT = process.env.DATABASE_DIALECT || 'mysql'),
      (obj.DATABASE_USER = process.env.DATABASE_USER),
      (obj.DATABASE_HOST = process.env.DATABASE_HOST),
      (obj.DATABASE_PORT = +process.env.DATABASE_PORT || 3306),
      (obj.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD),
      (obj.DATABASE_NAME = process.env.DATABASE_NAME),
      (obj.USE_DATABASE_LOG = Boolean(process.env.USE_DATABASE_LOG)),
      // SERVER
      (obj.NODE_ENV = process.env.NODE_ENV as NODE_ENV),
      (obj.SERVER_NAME = process.env.SERVER_NAME || 'Mail Service'),
      (obj.SERVER_PORT = +process.env.SERVER_PORT || 8000);
    // OWNER
    (obj.COMPANY_NAME = process.env.COMPANY_NAME),
      (obj.COMPANY_PHONE = process.env.COMPANY_PHONE),
      (obj.COMPANY_EMAIL = process.env.COMPANY_EMAIL);
    // ENCRYPTION
    obj.ENCRYPTION_PRIVATE_KEY =
      process.env.ENCRYPTION_PRIVATE_KEY || 'CAS_ENCRYPTION_PRIVATE_KEY';
    obj.JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
    obj.API_VERSION = 'api/v1';
    obj.SYNC_SEEDERS = Boolean(process.env.SYNC_SEEDERS || false);
    obj.REDIS_CONNECTION_URL =
      process.env.REDIS_CONNECTION_URL || 'redis://127.0.0.1:16379';
    obj.Q_LOOP_QUEUE_HOST =
      process.env.Q_LOOP_QUEUE_HOST || 'http://localhost:8001/api/v1';
    obj.SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    obj.CUSTOMER_DEFAULT_PHOTO_URL = '';
    obj.RESEND_API_KEY = process.env.RESEND_API_KEY;
    obj.MAILER_CREDENTIALS = {
      username: process.env.MAILER_USER,
      host: process.env.MAILER_HOST,
      service: 'gsmtp',
      password: process.env.MAILER_PASSWORD,
      port: process.env.MAILER_PORT || '3306',
    };

    return obj;
  }
}

config();

const configs = plainToClass(
  EnvConfig,
  { ...EnvConfig.getDefaultObject(), ...process.env },
  { enableImplicitConversion: true },
);

const errors = validateSync(configs, { whitelist: true });

if (errors.length > 0) {
  logger.error(JSON.stringify(errors, undefined, '  '));
  throw new Error('Invalid env variables.');
}

const verifyEmailFields = async () => {
  try {
    if (!(await EmailUtils.validateEmail(configs.SUPER_ADMIN_EMAIL))) {
      Logger.error(
        `Invalid Superadmin email ===> "${configs.SUPER_ADMIN_EMAIL}"`,
      );
      throw new Error(
        `Invalid Superadmin email ===> "${configs.SUPER_ADMIN_EMAIL}"`,
      );
    }
  } catch (e) {
    logger.error(e);
  }
};
verifyEmailFields();

export { configs };
