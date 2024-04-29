import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { CustomerSettingsService } from '../services/customer_settings.service';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { CustomerSettingDto } from '../dtos/customer_settings.dto';
import Customer from '../entities/customer.entity';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';

@Controller('customers/settings')
export class CustomerSettingsController {
  constructor(private customerSettingsService: CustomerSettingsService) {}

  @Get('all')
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

  @Put()
  @UseGuards(ActionsGuard)
  updateCustomerSettings(
    @Body() updates: CustomerSettingDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.customerSettingsService.updateCustomerSetting(
      customer,
      updates,
    );
  }

  @Get('me')
  @UseGuards(ActionsGuard)
  getMySettings(@GetCurrentCustomer('id') customerId: string) {
    return this.customerSettingsService.findSettingsById(customerId);
  }
}
