import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActionsGuard } from '../../auth/guards/actions_guard';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { ClientTagService } from '../services/client_tag.service';
import Customer from '../entities/customer.entity';
import { AssignBulkClientTagsDto, BulkClientTagDto, BulkDeleteClientTagsDto, ClientTagDto } from '../dtos/client_tag.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ClientDto } from '../dtos/client.dto';
import { ClientService } from '../services/client.service';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';

@Controller('clients/tags')
export class ClientTagController {
  constructor(
    private tagService: ClientTagService,
    private clientService: ClientService,
  ) {}

  @Post()
  @UseGuards(ActionsGuard)
  addTag(
    @Body() payload: ClientTagDto,
    @GetCurrentCustomer() customer: Customer,
  ) {
    return this.tagService.addTag({
      customer,
      customerId: customer.id,
      ...payload,
    });
  }

  @Post('bulk')
  @UseGuards(ActionsGuard)
  addBulkTags(
    @Body() payload: BulkClientTagDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.addBulkTags(customerId, payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getTags(
    @Query() queries: FindDataRequestDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.findAllRecords(customerId, {
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(ActionsGuard)
  getTagById(
    @Param('id') id: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.findOneById(customerId, id);
  }

  @Get('name/:name')
  @UseGuards(ActionsGuard)
  getTagByName(
    @Param('name') name: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.findOneByName(customerId, name);
  }

  @Delete('id/:id')
  @UseGuards(ActionsGuard)
  deleteTag(
    @Param('id') id: string,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.deleteTagById(customerId, id);
  }

  @Put('id/:id')
  @UseGuards(ActionsGuard)
  updateTag(
    @Param('id') id: string,
    @Body() payload: Partial<ClientTagDto>,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.updateClientTag(customerId, id, payload);
  }

  @Patch('assign/id/:clientId')
  @UseGuards(ActionsGuard)
  assignClientATag(
    @Param('clientId') clientId: string,
    @Body() { tags }: Pick<ClientDto, 'tags'>,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    if (!tags) {
      throw new HttpException('tags must be an array', HttpStatus.BAD_REQUEST);
    }
    const _tags = tags as unknown as string[];
    return this.clientService.assignTag(customerId, clientId, _tags);
  }

  @Patch('assign/bulk')
  @UseGuards(ActionsGuard)
  assignManyTagsToManyClients(
    @Body() payload: AssignBulkClientTagsDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.clientService.assignTagsToMany(customerId, payload);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getTagsByAdmin(
    @GetCurrentCustomer() adminCustomer: Customer,
    @Query() queries: FindDataRequestDto,
  ) {
    return this.tagService.findTagsByAdmin({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('statistics')
  @UseGuards(ActionsGuard)
  getTagsStats(@GetCurrentCustomer() customer: Customer) {
    return this.tagService.fetchTagsStats(customer);
  }

  @Delete('bulk')
  @UseGuards(ActionsGuard)
  deleteManyTags(
    @Body() payload: BulkDeleteClientTagsDto,
    @GetCurrentCustomer('id') customerId: string,
  ) {
    return this.tagService.deleteMany(customerId, payload.tags);
  }
}
