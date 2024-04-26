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
import { CustomerService } from '../services/customer.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { Request } from 'express';
import { AdminGuard } from '../../auth/guards/admin_guard';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import Customer from '../entities/customer.entity';
import { CustomerEncryptionDto } from '../dtos/customer_encryption.dto';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

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

  @Patch('encryption_key')
  @UseGuards(ActionsGuard)
  setCustomerEncryptionKey(
    @Body() encryptionDto: CustomerEncryptionDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.customerService.setEncryptionKey(customer, encryptionDto);
  }
}
