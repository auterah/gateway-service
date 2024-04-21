import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ConsumerService } from './consumer.service';
import { ActionsGuard } from '../auth/guards/actions_guard';
import { BulkConsumerDto, ConsumerDto } from './dtos/consumer.dto';

@Controller('consumers')
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @Post()
  @UseGuards(ActionsGuard)
  addCustomer(@Body() payload: ConsumerDto) {
    return this.consumerService.addConsumer(payload);
  }

  @Post('bulk')
  @UseGuards(ActionsGuard)
  addBulkCustomers(@Body() payload: BulkConsumerDto) {
    return this.consumerService.addBulkConsumers(payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getCustomers(@Query() queries: FindDataRequestDto) {
    return this.consumerService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }
}
