import {
  Body,
  Controller,
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
import { GetSignCustomer } from 'src/modules/auth/decorators/get_sign_customer.decorator';
import Customer from 'src/modules/customer/customer.entity';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { Request } from 'express';
import { AppRequestService } from './app_request.service';
import { AppScopeDto } from './dtos/app_scope.dto';
import App from './entities/app.entity';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';

@Controller('apps')
export class AppController {
  constructor(
    private appService: AppService,
    private appReqService: AppRequestService,
  ) {}

  @Get('x-app/:public_key') // For in app use only!
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
    });
  }

  @Post()
  // @UseGuards(ActionsGuard)
  createApp(@Body() newApp: AppDto) {
    return this.appService.createApp(newApp);
  }

  @Get()
  getApps(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.appService.findAllRecords({
      take,
      skip,
    });
  }

  // --- App request section
  @Get('requests')
  getAllRequests(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.appReqService.selectAllRecords({ take, skip });
  }

  // --- End App request section

  @Put('scopes')
  @UseGuards(ActionsGuard)
  addScope(@Body() scopeDto: AppScopeDto, @GetCurrentApp() app: App) {
    return this.appService.addScope(scopeDto, app);
  }

  @Get('/id/:app_id')
  getSingleApp(@Param('app_id') appId: string) {
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
}
