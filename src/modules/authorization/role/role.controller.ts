import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from '../dtos/mail.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';

@Controller('roles')
// @UseGuards(ActionsGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  createRole(
    @Body() newRole: RoleDto,
    // @GetSignCustomer() customer: Customer,
  ) {
    return this.roleService.createRole(newRole);
  }

  @Patch('add-permission/:role_id/:permission_id')
  addPermission(
    @Param('role_id') roleId: string,
    @Param('permission_id') permissionId: string,
  ) {
    return this.roleService.addPermission(roleId, permissionId);
  }

  @Get()
  getAllRoles(@Query() queries: FindDataRequestDto) {
    const take = Number(queries.take || '10');
    const skip = Number(queries.skip || '0');
    return this.roleService.findAllRecords({ take, skip });
  }
}
