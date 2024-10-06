import { configs } from 'config/config.env';
import Admin from '../../modules/admin/admin.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { CryptoUtil } from 'src/shared/utils/crypto';
import { Roles } from 'src/shared/enums/roles';
import Customer from 'src/modules/customer/entities/customer.entity';
import { StringUtils } from 'src/shared/utils/string';

export const defaultAdmin: Partial<Admin> = {
  email: configs.SUPER_ADMIN_EMAIL,
  otp: parseInt(AuthService.generateOtp(6)),
  password: CryptoUtil.generateRandomStringAsync(8),
  role: Roles.SUPER_ADMIN,
};

export const defaultAdminCustomer: Partial<Customer> = {
  businessName: StringUtils.generateRandomWord(),
  email: configs.SUPER_ADMIN_EMAIL,
  phone: '+2340971046909',
  role: Roles.SUPER_ADMIN,
};
