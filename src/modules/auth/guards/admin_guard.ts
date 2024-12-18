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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentAdmin } from 'src/shared/types/request';
import Admin from 'src/modules/admin/admin.entity';
import { Roles } from 'src/shared/enums/roles';
import axios from 'axios';
import Customer from 'src/modules/customer/entities/customer.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  private logger = new Logger(AdminGuard.name);

  private aesEncrypt: AesEncryption;
  constructor(private actionGuardEvent: EventEmitter2) {
    this.aesEncrypt = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);
  }

  async canActivate(ctx: ExecutionContext) {
    const request: CurrentAdmin = ctx.switchToHttp().getRequest();

    if (
      request.headers['authorization'] &&
      request.headers['authorization'].includes('Bearer ')
    ) {
      const admin = await this.verifyAdmin(request);
      request.admin = admin;

      const customer = await this.getAdminCustomer(request, admin);
      request.currentCustomer = customer;
    } else {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  private async verifyAdmin(request: CurrentAdmin): Promise<Admin> {
    const { authorization }: any = request.headers;
    // const xAdminURL = `${request.protocol}://${request.get('Host')}/${configs.API_VERSION}/admins/x-admin`; // Url does not exist yet

    if (
      !authorization ||
      authorization.trim() === '' ||
      !authorization.includes('Bearer')
    ) {
      throw new HttpException('Please provide token', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.split('Bearer')[1].trim();
    const decryptedToken = this.aesEncrypt.decrypt(token);

    if (!decryptedToken) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    try {
      JSON.parse(decryptedToken);
    } catch (error) {
      throw new HttpException('Invalid admin token', HttpStatus.UNAUTHORIZED);
    }

    const data = JSON.parse(decryptedToken);

    if (!data?.admin) {
      throw new HttpException('Invalid admin token', HttpStatus.UNAUTHORIZED);
    }

    const { admin } = data;

    if (admin.role != Roles.SUPER_ADMIN) {
      throw new HttpException('Access denied.', HttpStatus.UNAUTHORIZED);
    }
    return admin;
  }

  private async getAdminCustomer(
    request: CurrentAdmin,
    admin: Admin,
  ): Promise<Customer> {
    const xCustomerURL = `${request.protocol}://${request.get('Host')}/${configs.API_VERSION}/customers/x-customer`;

    try {
      const { data } = await axios.get(`${xCustomerURL}/${admin.email}`, {
        headers: {
          Authorization: '%x-customer/:email%',
        },
      });

      const customer: Customer = data?.data;

      // If customer is null
      if (!customer) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      if (customer.email !== admin.email) {
        throw new HttpException('Invalid Admin', HttpStatus.UNAUTHORIZED);
      }

      if (customer.role !== admin.role) {
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
