import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { configs } from 'config/config.env';
import { AesEncryption } from 'src/shared/utils/encryption';

const aesEncrypt = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);

export const GetSignCustomer = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (
      !request.headers['authorization'] ||
      !request.headers['authorization'].includes('Bearer')
    ) {
      throw new HttpException('Missing token', HttpStatus.UNAUTHORIZED);
    }

    const token = request.headers['authorization'].split('Bearer')[1].trim();
    const customer = aesEncrypt.decrypt(token);

    // const customer = new JwtService({
    //   secret: configs.JWT_SECRET,
    // }).decode(token);

    if (!customer) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (!JSON.parse(customer)?.customer) {
      throw new HttpException(
        'Invalid token. Missing customer',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return JSON.parse(customer)?.customer;
  },
);
