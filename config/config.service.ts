import { Injectable } from '@nestjs/common';
import { configs } from 'config/config.env';

@Injectable()
export class ConfigService {
  get sequelizeOrmConfig() {
    return {
      dialect: configs.DATABASE_DIALECT,
      host: configs.DATABASE_HOST,
      port: configs.DATABASE_PORT,
      username: configs.DATABASE_USER,
      password: configs.DATABASE_PASSWORD,
      database: configs.DATABASE_NAME,
      logging: configs.USE_DATABASE_LOG,
    };
  }
}
