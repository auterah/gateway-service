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
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';
import { CurrencyService } from '../services/currency.service';
import { CurrencyDto } from '../dtos/currency.dto';

@Controller('currencies')
export class CurrencyController {
  constructor(private currService: CurrencyService) {}

  @Post()
  @UseGuards(AdminGuard)
  addCurrency(@Body() payload: CurrencyDto) {
    throw new HttpException(
      'Service temporary suspended',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
    return this.currService.create(payload);
  }

  @Get()
  @UseGuards(AdminGuard)
  getCurrency(@Query() queries: FindDataRequestDto) {
    return this.currService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(AdminGuard)
  getCurrencyById(@Param('id') id: string) {
    return this.currService.findOneById(id);
  }

  @Delete('id/:id')
  @UseGuards(AdminGuard)
  deleteCurrency(@Param('id') id: string) {
    return this.currService.deleteOne({ id });
  }

  @Put('id/:id')
  @UseGuards(AdminGuard)
  updateCurrency(
    @Param('id') id: string,
    @Body() updates: Partial<CurrencyDto>,
  ) {
    throw new HttpException(
      'Service temporary suspended',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
    return this.currService.updateOneById(id, updates);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getCurrencies(@Query() queries: FindDataRequestDto) {
    return this.currService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }
}
