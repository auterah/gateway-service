import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { ReportService } from './report.service';
import { GetCurrentApp } from 'src/shared/decorators/get_current_app';
import App from '../app/entities/app.entity';
import { ActionsGuard } from '../auth/guards/actions_guard';

@Controller('reports')
@UseGuards(ActionsGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getReportsByApp(
    @Query() queries: FindDataRequestDto,
    @GetCurrentApp() app: App,
  ) {
    return this.reportService.findRecordsByAppId(app.id, queries);
  }

  @Get('id/:id')
  getSingleReportsByApp(
    @Query() queries: FindDataRequestDto,
    @Param('id') id: string,
    @GetCurrentApp() app: App,
  ) {
    return this.reportService.findSingleRecordByAppId(app.id);
  }

  @Get('all')
  getReportsByAdmin(@Query() queries: FindDataRequestDto) {}
}
