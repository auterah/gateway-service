import { configs } from 'config/config.env';
import Admin from '../../modules/admin/admin.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { CryptoUtil } from 'src/shared/utils/crypto';

export const defaultAdmin: Partial<Admin> = {
  email: configs.SUPER_ADMIN_EMAIL,
  otp: parseInt(AuthService.generateOtp(6)),
  password: CryptoUtil.generateRandomStringAsync(8),
};
