import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ClientService } from './client.service';
import { ActionsGuard } from '../auth/guards/actions_guard';
import { BulkClientDto, ClientDto } from './dtos/client.dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  @UseGuards(ActionsGuard)
  addClient(@Body() payload: ClientDto) {
    return this.clientService.addClient(payload);
  }

  @Post('bulk')
  @UseGuards(ActionsGuard)
  addBulkClient(@Body() payload: BulkClientDto) {
    return this.clientService.addBulkClients(payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getClients(@Query() queries: FindDataRequestDto) {
    return this.clientService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }
}
