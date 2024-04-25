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
import { ActionsGuard } from '../../auth/guards/actions_guard';
import { BulkClientDto, ClientDto } from '../dtos/client.dto';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { AdminGuard } from '../../auth/guards/admin_guard';
import Customer from '../entities/customer.entity';
import { ClientService } from '../services/client.service';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  @UseGuards(ActionsGuard)
  addClient(
    @Body() payload: ClientDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.clientService.addClient(customer, payload);
  }

  @Post('bulk')
  @UseGuards(ActionsGuard)
  addBulkClient(
    @Body() payload: BulkClientDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.clientService.addBulkClients(customer, payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getClients(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.findAllRecords({
      where: { customerId },
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(ActionsGuard)
  getClientById(
    @Param('id') clientId: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.findClientById(customerId, clientId);
  }

  @Delete('id/:id')
  @UseGuards(ActionsGuard)
  deleteClient(
    @Param('id') clientId: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.deleteClient(customerId, clientId);
  }

  @Put('id/:id')
  @UseGuards(ActionsGuard)
  updateClient(
    @Param('id') clientId: string,
    @Body() payload: Partial<ClientDto>,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.updateClient(customerId, clientId, payload, true);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getClientsByAdmin(@Query() queries: FindDataRequestDto) {
    return this.clientService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('statistics')
  @UseGuards(ActionsGuard)
  getStatistics(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.fetchClientStatistics(customerId, queries);
  }
}
