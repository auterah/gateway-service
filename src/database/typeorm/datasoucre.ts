import { TypeOrmNamingStrategy } from './typeorm-naming-strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configs } from 'config/config.env';
import { join } from 'path';

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configs.DATABASE_HOST,
  port: configs.DATABASE_PORT,
  username: configs.DATABASE_USER,
  password: configs.DATABASE_PASSWORD,
  database: configs.DATABASE_NAME,
  entities: [`${__dirname}/../../**/*.entity.{ts,js}`],
  migrations: [join(__dirname, '..', 'migrations/*.{ts,js}')],
  namingStrategy: new TypeOrmNamingStrategy(),
  // autoLoadEntities: true,
  // synchronize: true,
  logging: configs.USE_DATABASE_LOG,
  ssl: configs.NODE_ENV === 'test',
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;