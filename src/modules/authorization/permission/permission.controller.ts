import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionDto } from '../dtos/permission.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';

@Controller('permissions')
// @UseGuards(ActionsGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  createPermission(
    @Body() newPerm: PermissionDto,
    // @GetSignCustomer() customer: Customer,
  ) {
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
