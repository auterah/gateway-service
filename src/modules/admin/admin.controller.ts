import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SmtpDto } from './dtos/smtp.dto';
import { AdminService } from './admin.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingDto } from './dtos/billing.dto';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import App from '../app/entities/app.entity';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private adminEvents: EventEmitter2,
  ) {}

  @Post('smtp')
  addSMTPConfigs(@Body() smtpDto: SmtpDto) {
    return this.adminService.addSMTPConfigs(smtpDto);
  }

  @Get('configs')
  getConfigs(@Query() queries: FindDataRequestDto) {
    return this.adminService.findAllConfigRecords(queries);
  }

  @Post('billings')
  addBilling(@Body() payload: BillingDto) {
    return this.adminService.setBilling(payload);
  }

  @Get('billings')
  getBillings() {
    return this.adminService.getBillings();
  }

  @Get('billings/:app_id')
  getAppBillings(@Param('app_id') appId: string) {
    return this.adminService.getAppBillings(appId);
  }
}
