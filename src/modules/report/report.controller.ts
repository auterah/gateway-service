import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ReportService } from './report.service';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import App from '../app/entities/app.entity';
import { ActionsGuard } from '../auth/guards/actions_guard';
import { AdminGuard } from '../auth/guards/admin_guard';
import { VerifyDefaultConfigs } from 'src/guards/default_configs_guard';

@Controller('reports')
@UseGuards(VerifyDefaultConfigs)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @UseGuards(ActionsGuard)
  getReportsByApp(
    @Query() queries: FindDataRequestDto,
    @GetCurrentApp() app: App,
  ) {
    return this.reportService.findRecordsByAppId(app.id, queries);
  }

  @Get('id/:id')
  @UseGuards(ActionsGuard)
  getSingleReportsByApp(
    @Query() queries: FindDataRequestDto,
    @Param('id') tnxId: string,
    @GetCurrentApp() app: App,
  ) {
    return this.reportService.findSingleRecordByAppId(app.id, tnxId);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getReportsByAdmin(@Query() queries: FindDataRequestDto) {
    if (queries.app_id) {
      return this.reportService.findRecordsByAppId(queries.app_id, queries);
    }
    return this.reportService.findAllTransactionRecords(queries);
  }
}
