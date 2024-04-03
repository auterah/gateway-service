import { CryptoUtil } from 'src/shared/utils/crypto';
import App from 'src/modules/app/entities/app.entity';
import { AppService } from 'src/modules/app/app.service';

export const defaultApp: Partial<App> = {
  name: CryptoUtil.generateRandomStringAsync(8),
  privateKey: AppService.generatePrivateKey(),
  publicKey: AppService.generatePublicKey(),
};
