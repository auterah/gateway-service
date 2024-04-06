import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { configs } from 'config/config.env';
import { AesEncryption } from 'src/shared/utils/encryption';
import axios from 'axios';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import AppRequest from 'src/modules/app/entities/app_request.entity';
import App from 'src/modules/app/entities/app.entity';
import { EAppRequestStatus } from 'src/modules/app/enums/app_request_status';
import { AppRequestEvents } from 'src/shared/events/app.events';
import { CurrentApp, CurrentCustomer } from 'src/shared/types/request';
import Customer from 'src/modules/customer/customer.entity';

@Injectable()
export class ActionsGuard implements CanActivate {
  private logger = new Logger(ActionsGuard.name);

  private aesEncrypt: AesEncryption;
  constructor(private actionGuardEvent: EventEmitter2) {
    this.aesEncrypt = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);
  }

  async canActivate(ctx: ExecutionContext) {
    const request: Request & { currentApp: App; currentCustomer: Customer } =
      ctx.switchToHttp().getRequest();

    if (request.headers['x-api-key']) {
      const app = await this.verifyAppKey(request);
      request.currentApp = app;
    } else if (
      request.headers['authorization'] &&
      request.headers['authorization'].includes('Bearer ')
    ) {
      const customer = await this.verifyCustomer(request);
      request.currentCustomer = customer;
    } else {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  private async verifyAppKey(request: CurrentApp) {
    const xAppURL = `${request.protocol}://${request.get('Host')}/${configs.API_VERSION}/apps/x-app`;
    const appPublicKey = request.headers['x-api-key'];

    if (appPublicKey == '' || appPublicKey?.length == 0) {
      throw new HttpException(
        'Please provide app public key',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const { data } = await axios.get(`${xAppURL}/${appPublicKey}`, {
        headers: {
          Authorization: '%x-app/:app%',
        },
      });

      // If app is null
      if (!data?.data) {
        throw new HttpException('Invalid public key', HttpStatus.UNAUTHORIZED);
      }

      const app: App = data?.data;

      // Emit New App request event
      const appReq: Partial<AppRequest> = {
        appId: app.id,
        route: request.url,
        status: EAppRequestStatus.SUCCESS,
      };

      if (!app.customer.verified) {
        throw new HttpException(
          'Access denied. Verify your email address to use this service',
          HttpStatus.FORBIDDEN,
        );
      }

      if (!request.url.includes('scopes')) {
        //
        const permitted = app.scopes.find((e) =>
          request.url.includes(e.target),
        );

        if (!permitted) {
          throw new HttpException(
            'Access denied. You are not allowed to use this service',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      this.actionGuardEvent.emit(AppRequestEvents.NEW_REQUEST, appReq);

      this.logger.verbose(`app: ${app.name}`, JSON.stringify(app));
      return app;
    } catch (e: any) {
      throw new HttpException(
        e?.message || 'Something went wrong',
        e?.status || HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  private async verifyCustomer(request: CurrentCustomer) {
    const { authorization }: any = request.headers;
    const xCustomerURL = `${request.protocol}://${request.get('Host')}/${configs.API_VERSION}/customers/x-customer`;

    if (
      !authorization ||
      authorization.trim() === '' ||
      !authorization.includes('Bearer')
    ) {
      throw new HttpException('Please provide token', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.split('Bearer')[1].trim();
    const decryptedToken = this.aesEncrypt.decrypt(token);

    // const customer = new JwtService({
    //   secret: configs.JWT_SECRET,
    // }).decode(token);

    if (!decryptedToken) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (!JSON.parse(decryptedToken)?.customer) {
      throw new HttpException(
        'Invalid token. Missing customer',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const { data } = await axios.get(
        `${xCustomerURL}/${JSON.parse(decryptedToken)?.customer?.email}`,
        {
          headers: {
            Authorization: '%x-customer/:email%',
          },
        },
      );

      const customer: Customer = data?.data;

      // If customer is null
      if (!customer) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      this.logger.verbose(
        `customer: ${customer.businessName}`,
        JSON.stringify(customer),
      );
      return customer;
    } catch (e: any) {
      throw new HttpException(
        e?.message || 'Something went wrong',
        e?.status || HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
