import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { Request } from 'express';
import { AdminGuard } from '../../auth/guards/admin_guard';
import { CustomerSettingsService } from '../services/customer_settings.service';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { CustomerSettingDto } from '../dtos/customer_settings.dto';
import Customer from '../entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private customerSettingsService: CustomerSettingsService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getCustomers(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.customerService.findAllRecords({ take, skip });
  }

  @Get('x-customer/:email') // For in app use only!
  getXCustomerByEmail(
    @Param('email') email: string,
    @Req() { headers }: Request,
  ) {
    const authorization = headers.authorization;
    if (authorization !== '%x-customer/:email%') {
      throw new HttpException('Please provide token', HttpStatus.UNAUTHORIZED);
    }
    return this.customerService.findXCustomer({
      where: { email },
    });
  }

  @Get('settings')
  @UseGuards(AdminGuard)
  getCustomerSettings(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.customerSettingsService.findAllRecords(customerId, {
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Put('settings')
  @UseGuards(AdminGuard)
  updateCustomerSettings(
    @Body() updates: CustomerSettingDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.customerSettingsService.updateCustomerSetting(
      customer,
      updates,
    );
  }
}
