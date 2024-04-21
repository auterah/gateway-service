import { Module } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Client from './client.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), CustomerModule],
  providers: [ClientRepository, ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
