import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig)],
})
export class databaseTypeormModule {}
