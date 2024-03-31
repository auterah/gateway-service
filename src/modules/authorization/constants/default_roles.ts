import { Roles } from 'src/shared/enums/roles';
import Role from '../role/role.entity';

export const adminRole: Partial<Role> = {
  role: Roles.ADMIN,
};

export const superAdminRole: Partial<Role> = {
  role: Roles.SUPER_ADMIN,
};
