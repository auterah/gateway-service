import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { AdminGuard } from '../auth/guards/admin_guard';
import { AppRequestService } from '../app/app_request.service';

@Controller('reports/api')
export class ApiReportController {
  constructor(private appReqService: AppRequestService) {}

  @Get('requests')
  @UseGuards(AdminGuard)
  getAllRequests(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.appReqService.selectAllRecords({ take, skip });
  }
}
