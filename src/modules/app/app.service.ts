import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import App from './entities/app.entity';
import { AppDto } from './dtos/newapp.dto';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AppRepository } from './repositories/app.repository';
import { AppScopeDto } from './dtos/app_scope.dto';
import { PermissionService } from '../authorization/permission/permission.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents } from 'src/shared/events/app.events';
import { StringUtils } from 'src/shared/utils/string';
import Customer from '../customer/entities/customer.entity';
import { HttpStatusCode } from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepo: AppRepository,
    private readonly permService: PermissionService,
    private readonly appEvent: EventEmitter2,
  ) {}

  static generatePrivateKey() {
    return (
      'PRIVATE_KEY' +
      '__' +
      StringUtils.generateRandomAlphabets(20) +
      Date.now() +
      '=='
    );
  }

  static generatePublicKey() {
    return (
      'PUBLIC_KEY' +
      '__' +
      StringUtils.generateRandomAlphabets(20) +
      Date.now() +
      '=='
    );
  }

  // Add New App
  async createApp(customer: Customer, newApp: AppDto): Promise<App> {
    // const exist = await this.findOneByAppName(newApp.name);
    // if (exist) {
    //   throw new HttpException('Name already exist', HttpStatus.BAD_REQUEST);
    // }
    const customerHasApp = await this.appRepo.customerHasApp(
      customer.id,
    );
    if (customerHasApp) {
      throw new HttpException(
        'Upgrade is required to create more apps. Need help with account upgrade? https://hello.sendpouch.com/upgrade',
        HttpStatus.FORBIDDEN,
      );
    }

    const defaultPermissions = await this.permService.findAllRecords({
      where: { default: true },
    });

    newApp.scopes = defaultPermissions.records;
    newApp.privateKey = AppService.generatePrivateKey();
    newApp.publicKey = AppService.generatePublicKey();
    

    const app = await this.appRepo.create(customer, newApp);
    delete app.customer;
    this.appEvent.emit(AppEvents.CREATED, app);
    return app;
  }

  // Find Single App
  findOne(findOpts: FindOneOptions<App>): Promise<App> {
    return this.appRepo.findOne(findOpts);
  }

  // Find App By ID
  findById(id: string): Promise<App> {
    return this.appRepo.findOne({ where: { id } });
  }

  // Find App By App key
  findOneByPublicKey(publicKey: string): Promise<App> {
    return this.appRepo.findOneByPublicKey(publicKey);
  }

  // Find App By App Name
  findOneByAppName(name: string): Promise<App> {
    return this.appRepo.findOneByAppName(name);
  }

  // Find All Apps
  findAllRecords(findOpts: FindManyOptions<App>): Promise<App> {
    return this.appRepo.findAllRecords(findOpts);
  }

  // Find Unknown(X) App
  findXApp(findOpts: FindOneOptions<App>): Promise<App> {
    return this.appRepo.findXApp({
      ...findOpts,
      relations: findOpts.relations || ['scopes'],
    });
  }

  async addScope(scopeDto: AppScopeDto, app: App) {
    const list = [];

    const permissions = await this.permService.findByIds(scopeDto.scopes, true);
    list.push(...permissions, ...app.scopes);
    app.scopes = [...new Map(list.map((item) => [item['id'], item])).values()];

    const result = await this.appRepo.save(app);
    delete result.customer.apps;
    return result;
  }

  async removeScope(scopeDto: AppScopeDto, app: App) {
    const permissions = await this.permService.findByIds(scopeDto.scopes, true);
    app.scopes = app.scopes.filter((e, i) => e.id != scopeDto.scopes[i]);
    await this.appRepo.save(app);
    return `Found & removed ${permissions.length} scope(s)`;
  }

  updateOne(
    where: FindOptionsWhere<App>,
    updates: Partial<App>,
    returnNew = false,
  ) {
    return this.appRepo.updateOne(where, updates, returnNew);
  }

  async deleteCustomerApp(customerId: string, appId: string) {
    try {
      const app = await this.findOne({ where: { customer: { id: customerId }, id: appId }});
      if (!app) {
        throw new HttpException('App not found', HttpStatusCode.UnprocessableEntity);
      }
      await this.appRepo.remove(app);
    } catch (error) {
      throw error;
    }
  }
}
