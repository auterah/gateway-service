import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppDto } from './dtos/newapp.dto';
import { AppService } from './app.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { Request } from 'express';
import { AppScopeDto } from './dtos/app_scope.dto';
import App from './entities/app.entity';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { AdminGuard } from '../auth/guards/admin_guard';
import { VerifyDefaultConfigs } from 'src/guards/default_configs_guard';
import { EmailService } from '../email/services/email.service';
import { SmtpDto } from 'src/dtos/smtp.dto';
import Customer from '../customer/entities/customer.entity';

@Controller('apps')
@UseGuards(VerifyDefaultConfigs)
export class AppController {
  constructor(
    private appService: AppService,
    private emailService: EmailService,
  ) {}

  @Get('x-app/pub/:public_key') // For in app use only!
  getXAppByPublickey(
    @Param('public_key') publicKey: string,
    @Req() { headers }: Request,
  ) {
    const authorization = headers.authorization;
    if (authorization !== '%x-app/:app%') {
      throw new HttpException('Access denied!', HttpStatus.UNAUTHORIZED);
    }
    return this.appService.findXApp({
      where: { publicKey },
      relations: ['customer'],
    });
  }

  @Get('x-app/puk/:private_key') // For in app use only!
  getXAppByPrivatekey(
    @Param('private_key') privateKey: string,
    @Req() { headers }: Request,
  ) {
    const authorization = headers.authorization;
    if (authorization !== '%x-app/:app%') {
      throw new HttpException('Access denied!', HttpStatus.UNAUTHORIZED);
    }
    return this.appService.findXApp({
      where: { privateKey },
      relations: ['customer'],
    });
  }

  @Post()
  @UseGuards(ActionsGuard)
  createApp(@GetCurrentCustomer() customer: Customer, @Body() newApp: AppDto) {
    return this.appService.createApp(customer, newApp);
  }

  @Get()
  @UseGuards(AdminGuard)
  getApps(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.appService.findAllRecords({
      take,
      skip,
    });
  }

  @Put('scopes')
  @UseGuards(ActionsGuard)
  @UseGuards(AdminGuard)
  addScope(@Body() scopeDto: AppScopeDto, @GetCurrentApp() app: App) {
    return this.appService.addScope(scopeDto, app);
  }

  @Delete('scopes')
  @UseGuards(ActionsGuard)
  @UseGuards(AdminGuard)
  removeScope(@Body() scopeDto: AppScopeDto, @GetCurrentApp() app: App) {
    return this.appService.removeScope(scopeDto, app);
  }

  @Get('/id/:appId')
  getSingleApp(@Param('appId') appId: string) {
    return this.appService.findById(appId);
  }

  @Get('me')
  @UseGuards(ActionsGuard)
  getCustomerApps(
    @GetCurrentCustomer('apps') apps: App[],
    @Query('id') id: string,
  ) {
    if (id) {
      return apps.find((app) => app.id == id);
    }
    return apps;
  }

  @Post('smtps')
  @UseGuards(ActionsGuard)
  addAppSmtp(@Body() newSmtp: SmtpDto, @GetCurrentApp() app: App) { //todo: Move to smtp controller
    return this.emailService.addSMTP(app, newSmtp);
  }

  @Get('smtps')
  @UseGuards(ActionsGuard)
  getAppSmtp(@GetCurrentApp('id') appId: string) { //todo: Move to smtp controller
    return this.emailService.findSmtpByAppId(appId);
  }

  @Get('smtps/all')
  @UseGuards(AdminGuard)
  getAlSmtp(@Query() queries: FindDataRequestDto) { //todo: Move to smtp controller
    if (queries.id) {
      return this.emailService.findSmtpByAppId(queries.id);
    }
    return this.emailService.fetchAllSmtp(queries);
  }

  @Delete('id/:appId')
  @UseGuards(ActionsGuard)
  deleteApp(
    @GetCurrentCustomer('id') customerId: string,
    @Param('appId') appId: string,
  ) {
    return this.appService.deleteCustomerApp(customerId, appId);
  }
}
