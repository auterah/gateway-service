import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import App from '../entities/app.entity';
import { AppDto } from '../dtos/newapp.dto';
import { defaultAdmin } from 'src/database/mocks/default_admins';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BootEvents } from 'src/shared/events/local.events';
import Customer from 'src/modules/customer/entities/customer.entity';

@Injectable()
export class AppRepository {
  constructor(
    @InjectRepository(App)
    private readonly appEntity: Repository<App>,
    private readonly appEvent: EventEmitter2,
  ) {
    this.memorizeAdminApp();
  }

  // Create App
  async create(customer: Customer, newApp: Partial<App>): Promise<App> {
    const app = this.appEntity.create({
      ...newApp,
      customer,
    });
    return this.appEntity.save(app);
  }

  // Find Single App
  findOne(findOpts: FindOneOptions<App>): Promise<App> {
    return this.appEntity.findOne(findOpts);
  }

  // Find App By App key
  findOneByPublicKey(publicKey: string): Promise<App> {
    return this.findOne({
      where: { publicKey },
    });
  }

  // Find App By App Name
  findOneByAppName(name: string): Promise<App> {
    return this.findOne({
      where: { name },
    });
  }

  // Find All Apps
  async findAllRecords(findOpts: FindManyOptions<App>): Promise<any> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const apps = await this.appEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(apps, skip, take);
  }

  // Find Unknown(X) App
  findXApp(findOpts: FindOneOptions<App>): Promise<App> {
    return this.findOne(findOpts);
  }

  save(app: Partial<App>): Promise<App> {
    return this.appEntity.save(app);
  }

  remove(app: App): Promise<App> {
    return this.appEntity.remove(app);
  }

  // Find App By Customer Email
  async findAppByCustomerEmail(email: string): Promise<App> {
    const app: App = await this.appEntity.manager
      .getRepository<App>(App)
      .createQueryBuilder('apps')
      .leftJoinAndSelect('apps.customer', 'customer')
      .where('customer.email = :email', { email })
      .getOne();
    return app;
  }

  async memorizeAdminApp() {
    const app = await this.findAppByCustomerEmail(defaultAdmin.email);
    this.appEvent.emit(BootEvents.ADMIN_APP_IS_SET, app); // Use GLOBAL variable instead of event emitter
  }

  // Update Single App
  async updateOne(
    where: FindOptionsWhere<App>,
    updates: Partial<App>,
    returnNew = false,
  ): Promise<App | void> {
    await this.appEntity.update(where, updates);
    if (returnNew) return this.appEntity.findOne({ where: { id: where.id } });
  }

  // Customer Has An App
  async customerHasApp(customerId: string): Promise<boolean> {
    const apps = await this.appEntity.find({
      where: { customer: { id: customerId } },
      // relations: ['customer']
    });
    return !!apps.length;
  }

  async findByCustomerIdOrAppNameOrDomain(
    customerId: string,
    appName: string,
    domain: string,
  ): Promise<App> {
    return this.appEntity
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .orWhere('app.name = :name', { name: appName })
      .orWhere('app.domain = :domain', { domain })
      .getOne();
  }
}
