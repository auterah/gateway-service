import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';
import { plainToClass } from 'class-transformer';
import { Logger } from '@nestjs/common';

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
  Q_LOOP_PUBLIC_KEY: string;

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
    obj.Q_LOOP_PUBLIC_KEY = process.env.Q_LOOP_PUBLIC_KEY;

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

export { configs };
