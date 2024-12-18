import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import { VerifyDefaultConfigs } from 'src/guards/default_configs_guard';
import App from 'src/modules/app/entities/app.entity';
import { ActionsGuard } from 'src/modules/auth/guards/actions_guard';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';
import { ReportService } from '../services/report.service';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import Customer from 'src/modules/customer/entities/customer.entity';

@Controller('reports')
@UseGuards(VerifyDefaultConfigs)
export class ReportController {
  constructor(private readonly reportService?: ReportService) {}

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

  @Get('overview')
  @UseGuards(ActionsGuard)
  getOverview(@Query() queries: FindDataRequestDto,  @GetCurrentApp('id') appId: string,) {
    return this.reportService.fetchStatisticsByAppId(appId, queries);
  }

  @Get('statistics')
  @UseGuards(ActionsGuard)
  getStatistics(
    @Query() queries: FindDataRequestDto,
    @GetCurrentApp() app: App,
  ) {
    return this.reportService.fetchStatisticsByAppId(app.id, queries);
  }

  // -- SuperAdmin Reports
  @Get('all')
  @UseGuards(AdminGuard)
  getReportsByAdmin(@Query() queries: FindDataRequestDto) {
    if (queries.app_id) {
      return this.reportService.findRecordsByAppId(queries.app_id, queries);
    }
    return this.reportService.findAllTransactionRecords(queries);
  }
  // -- End SuperAdmin Reports
}
