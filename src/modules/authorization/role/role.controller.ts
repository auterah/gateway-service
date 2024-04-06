import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from '../dtos/mail.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { AdminGuard } from 'src/modules/auth/guards/admin_guard';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @UseGuards(AdminGuard)
  createRole(@Body() newRole: RoleDto) {
    return this.roleService.createRole(newRole);
  }

  // @Patch('add-permission/:role_id/:permission_id')
  // @UseGuards(AdminGuard)
  // addPermission(
  //   @Param('role_id') roleId: string,
  //   @Param('permission_id') permissionId: string,
  // ) {
  //   return this.roleService.addPermission(roleId, permissionId);
  // }

  @Get()
  getAllRoles(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.roleService.findAllRecords({ take, skip });
  }
}
