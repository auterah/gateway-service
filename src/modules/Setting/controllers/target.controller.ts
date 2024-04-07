import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { VerifyDefaultConfigs } from 'src/guards/default_configs_guard';
import { SettingService } from '../setting.service';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';

@Controller('targets')
@UseGuards(VerifyDefaultConfigs)
export class TargetController {
  constructor(private settingService: SettingService) {}

  @Get()
  @UseGuards(AdminGuard)
  getApps(@Query() queries: FindDataRequestDto) {
    return this.settingService.findAllTargetRecords(queries);
  }
}
