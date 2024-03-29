import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionDto } from '../dtos/permission.dto';

@Controller('permissions')
// @UseGuards(ActionsGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  createRole(
    @Body() newPerm: PermissionDto,
    // @GetSignCustomer() customer: Customer,
  ) {
    return this.permissionService.createPermission(newPerm);
  }
}
