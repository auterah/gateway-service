import { Module } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Client from './client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientRepository, ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
