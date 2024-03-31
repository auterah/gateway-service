import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import App from './entities/app.entity';
import { AppDto } from './dtos/newapp.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AppRepository } from './repositories/app.repository';
import { AppScopeDto } from './dtos/app_scope.dto';
import { PermissionService } from '../authorization/permission/permission.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents } from 'src/shared/events/app.events';
import { StringUtils } from 'src/shared/utils/string';

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

  static generateOtp(length: number) {
    const digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
  }

  // Add New App
  async createApp(newApp: AppDto): Promise<App> {
    const exist = await this.findOneByAppName(newApp.name);
    if (exist) {
      throw new HttpException('Name already exist', HttpStatus.BAD_REQUEST);
    }

    newApp.privateKey = AppService.generatePrivateKey();
    newApp.publicKey = AppService.generatePublicKey();

    const app = await this.appRepo.create(newApp);
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
      relations: ['scopes'],
    });
  }

  async addScope(scopeDto: AppScopeDto, app: App) {
    const permissions = await this.permService.findByIds(scopeDto.scopes, true);
    app.scopes.push(...permissions);
    return this.appRepo.save(app);
  }
}
