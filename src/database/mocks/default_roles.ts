import Role from 'src/modules/authorization/role/role.entity';
import { Roles } from 'src/shared/enums/roles';

export const adminRole: Partial<Role> = {
  role: Roles.ADMIN,
};

export const superAdminRole: Partial<Role> = {
  role: Roles.SUPER_ADMIN,
};
