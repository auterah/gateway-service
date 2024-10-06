import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ActionsGuard } from '../../auth/guards/actions_guard';
import { BulkClientDto, ClientDto } from '../dtos/client.dto';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { AdminGuard } from '../../auth/guards/admin_guard';
import Customer from '../entities/customer.entity';
import { ClientService } from '../services/client.service';
import { ClientSource } from '../enums/client_source.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from 'src/modules/file/types/file';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import App from 'src/modules/app/entities/app.entity';
import { AddEmailList } from '../dtos/add_email_list.dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post('add')
  @UseGuards(ActionsGuard)
  addClient(@Body() payload: ClientDto, @GetCurrentApp() app: App) {
    return this.clientService.addClient(app, payload);
  }

  // @Post('bulk')
  // @UseGuards(ActionsGuard)
  // addBulkClient(
  //   @Body() payload: BulkClientDto,
  //   @GetCurrentCustomer() customer: Customer,
  // ) {
  //   payload.source = ClientSource.BY_ADMIN;
  //   return this.clientService.addBulkClients(customer, payload);
  // }

  @Post('bulk-add')
  @UseGuards(ActionsGuard)
  addBulkClientFromList(
    @Body() payload: BulkClientDto,
    @GetCurrentApp() app: App,
  ) {
    // payload.source = ClientSource.BY_COPY_AND_PASTE;
    return this.clientService.addBulkClients(app, payload);
  }

  @Post('email-list')
  @UseGuards(ActionsGuard)
  addEmailList(@Body() emailList: AddEmailList, @GetCurrentApp() app: App) {
    return this.clientService.handleEmailList(app, emailList);
  }

  @Post('file-uploads')
  @UseGuards(ActionsGuard)
  @UseInterceptors(FileInterceptor('file')) // 'file' is the name of the form field
  async uploadFile(
    @UploadedFile() file: FileType,
    @GetCurrentCustomer() customer: Customer,
  ) {
    await this.clientService.handleClientsUpload(customer, file);
    return 'Upload in progress...';
  }

  @Get()
  @UseGuards(ActionsGuard)
  getClients(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    const where = queries.app_id
      ? { customerId, appId: queries.app_id }
      : { customerId };
    return this.clientService.findAllRecords({
      where,
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
