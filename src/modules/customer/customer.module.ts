import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Customer from './entities/customer.entity';
import { AuthorizationModule } from '../authorization/authorization.module';
import { CustomerRepository } from './repositories/customer.repository';
import { ClientTagController } from './controllers/client_tag.controller';
import Client from './entities/client.entity';
import ClientTag from './entities/client_tag.entity';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientTagService } from './services/client_tag.service';
import { ClientRepository } from './repositories/client.repository';
import { ClientTagRepository } from './repositories/client_tag.repository';
import CustomerSettings from './entities/customer_settings.entity';
import { CustomerSettingsRepository } from './repositories/customer_settings.repository';
import { CustomerSettingsService } from './services/customer_settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Client, ClientTag, CustomerSettings]),
    AuthorizationModule,
  ],
  controllers: [CustomerController, ClientTagController, ClientController],
  providers: [
    CustomerService,
    ClientService,
    ClientTagService,
    CustomerRepository,
    ClientRepository,
    ClientTagRepository,
    CustomerSettingsService,
    CustomerSettingsRepository,
  ],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
