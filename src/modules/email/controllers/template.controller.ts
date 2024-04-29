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
  UseGuards,
} from '@nestjs/common';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { TemplateService } from '../services/template.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { TemplateDto } from '../dtos/template.dto';

@Controller('templates')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Post()
  @UseGuards(ActionsGuard)
  addTemplate(
    @GetCurrentCustomer('id') customerId: string,
    @Body() payload: TemplateDto,
  ) {
    return this.templateService.create(customerId, payload);
  }

  @Get()
  @UseGuards(ActionsGuard)
  getTemplates(
    @GetCurrentCustomer('id') customerId: string,
    @Query() findOpts: FindDataRequestDto,
  ) {
    return this.templateService.findAllRecords(customerId, {
      take: Number(findOpts.take || '10'),
      skip: Number(findOpts.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(ActionsGuard)
  getTemplateById(
    @GetCurrentCustomer('id') customerId: string,
    @Query('id') id: string,
  ) {
    return this.templateService.findOneById(customerId, id);
  }
}
