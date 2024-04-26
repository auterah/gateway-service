import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { CustomerAddressService } from '../services/customer_address.service';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import Customer from '../entities/customer.entity';
import { CustomerAddressDto } from '../dtos/customer_address.dto';

@Controller('customers/addresses')
export class CustomerAddressController {
  constructor(private addressService: CustomerAddressService) {}

  @Post()
  @UseGuards(ActionsGuard)
  addCustomerAddress(
    @Body() payload: CustomerAddressDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.addressService.create(customer, payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getAddresses(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.addressService.findAllRecords(customerId, {
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(ActionsGuard)
  getCustomerAddress(
    @Param('id') id: string,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.addressService.findOneById(customer.id, {
      where: {
        id,
      },
    });
  }

  @Put('id/:id')
  @UseGuards(ActionsGuard)
  updateCustomerAddress(
    @Body() updates: CustomerAddressDto,
    @Param('id') id: string,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.addressService.updateOne(id, customer, updates);
  }

  @Delete('id/:id')
  @UseGuards(ActionsGuard)
  deleteCustomerAddress(
    @Param('id') id: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.addressService.deleteOne(customerId, { where: { id } });
  }

  @Get('all')
  @UseGuards(ActionsGuard)
  getAllAddresses(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.addressService.findAllRecords(customerId, { take, skip });
  }
}
