import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionDto } from '../dtos/permission.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';

@Controller('permissions')
// @UseGuards(ActionsGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  @UseGuards(AdminGuard)
  createPermission(@Body() newPerm: PermissionDto) {
    return this.permissionService.createPermission(newPerm);
  }

  @Get()
  getAllPermissions(@Query() queries: FindDataRequestDto) {
    return this.permissionService.findAllRecords({
      skip: +queries.skip,
      take: +queries.take,
    });
  }
}
