import { Module } from '@nestjs/common';
import { ConsumerRepository } from './consumer.repository';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Consumer from './consumer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consumer])],
  providers: [ConsumerRepository, ConsumerService],
  controllers: [ConsumerController],
})
export class ConsumerModule {}
