import { Module } from '@nestjs/common';
import { databaseTypeormModule } from './typeorm/typeorm.module';

@Module({
  imports: [databaseTypeormModule],
})
export class DatabaseModule {}