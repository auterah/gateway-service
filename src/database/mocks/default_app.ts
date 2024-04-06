import App from 'src/modules/app/entities/app.entity';
import { AppService } from 'src/modules/app/app.service';
import { StringUtils } from 'src/shared/utils/string';

export const defaultApp: Partial<App> = {
  name: StringUtils.generateRandomWord(),
  privateKey: AppService.generatePrivateKey(),
  publicKey: AppService.generatePublicKey(),
};
