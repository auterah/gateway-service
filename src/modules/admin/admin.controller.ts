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
}
