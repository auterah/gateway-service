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
import CustomerAddress from './entities/customer_address.entity';
import { CustomerAddressRepository } from './repositories/customer_address.repository';
import { CustomerAddressService } from './services/customer_address.service';
import { CustomerAddressController } from './controllers/customer_address.controller';
import { RegionModule } from '../region/region.module';
import { CustomerSettingsController } from './controllers/customer_settings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Client,
      ClientTag,
      CustomerSettings,
      CustomerAddress,
    ]),
    AuthorizationModule,
    RegionModule,
  ],
  controllers: [
    CustomerController,
    ClientTagController,
    ClientController,
    CustomerAddressController,
    CustomerSettingsController,
  ],
  providers: [
    CustomerService,
    ClientService,
    ClientTagService,
    CustomerRepository,
    ClientRepository,
    ClientTagRepository,
    CustomerSettingsService,
    CustomerSettingsRepository,
    CustomerAddressRepository,
    CustomerAddressService,
  ],
  exports: [CustomerService, CustomerRepository, CustomerAddressRepository],
})
export class CustomerModule {}
