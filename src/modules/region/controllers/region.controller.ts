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
import { RegionService } from '../services/region.service';
import { RegionDto } from '../dtos/region.dto';

@Controller('regions')
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Post()
  @UseGuards(AdminGuard)
  addRegion(@Body() payload: RegionDto) {
    return this.regionService.create(payload);
  }

  @Get()
  @UseGuards(AdminGuard)
  getRegion(@Query() queries: FindDataRequestDto) {
    return this.regionService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }

  @Get('id/:id')
  @UseGuards(AdminGuard)
  getCurrencyById(@Param('id') id: string) {
    return this.regionService.findOneById(id);
  }

  @Delete('id/:id')
  @UseGuards(AdminGuard)
  deleteCurrency(@Param('id') id: string) {
    return this.regionService.deleteOne({ id });
  }

  @Put('id/:id')
  @UseGuards(AdminGuard)
  updateCurrency(@Param('id') id: string, @Body() updates: Partial<RegionDto>) {
    throw new HttpException(
      'Service temporary suspended',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
    return this.regionService.updateOneById(id, updates);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getCurrencies(@Query() queries: FindDataRequestDto) {
    return this.regionService.findAllRecords({
      take: Number(queries.take || '10'),
      skip: Number(queries.skip || '0'),
    });
  }
}
