import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GDefaultBilling } from 'src/global/globals';

@Injectable()
export class VerifyDefaultConfigs implements CanActivate {
  private logger = new Logger(VerifyDefaultConfigs.name);

  async canActivate(ctx: ExecutionContext) {
    return true;
    try {
      if (!GDefaultBilling.get()) {
        throw 'Default bill is missing';
      }
    } catch (e) {
      throw new HttpException(
        `${VerifyDefaultConfigs.name}: App requires some defaults configs to work properly`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return true;
  }
}
