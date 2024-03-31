import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
// import { UsersService } from '../user.service';
// import { CryptoEncrypt } from 'src/shared/encrypt';
// import { ConfigService } from 'config/config.service';
// import User from '../entities/user.entity';
import { configs } from 'config/config.env';
import { AdminJwtPayload, JwtPayload } from './jwt/jwt-payload.model';
import App from 'src/modules/app/entities/app.entity';
import { SignTokenDto } from 'src/modules/app/dtos/sign_token.dto';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CustomerDto } from 'src/modules/customer/dtos/customer.dto';
import { EvemitterService } from 'src/shared/evemitter/evemitter.service';
import { CustomerEvents } from 'src/shared/events/customer.events';
import Customer from 'src/modules/customer/customer.entity';
import { GenTokenDto } from './dtos/generate_token.dto';
import { AesEncryption } from 'src/shared/utils/encryption';
import { OtpSignInDto } from './dtos/otp_signin.dto';
import { AppService } from '../app/app.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailEvents } from 'src/shared/events/mail.events';
import { VerifyOtpDto } from './dtos/veriy_otp.dto';
import { SignAdminToken } from './dtos/sign_admin_token.dto';
import { AdminService } from '../admin/admin.service';
import Admin from '../admin/admin.entity';
import { optMailTemplate } from '../email/templates/auth';

@Injectable()
export class AuthService {
  private readonly jwtPrivateKey: string;
  private aesEncrypt: AesEncryption;

  constructor(
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private customerEvents: EvemitterService<Customer>,
    private authEvents: EventEmitter2,
  ) {
    this.jwtPrivateKey = configs.JWT_SECRET;
    this.aesEncrypt = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);
  }

  static generateOtp(length: number) {
    const digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
  }

  async getCustomerBySignedToken(token: string): Promise<Customer> {
    if (!token) {
      throw new HttpException('Please provide token', HttpStatus.BAD_REQUEST);
    }

    const customer = this.decryptToken(token);

    if (!customer) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (!JSON.parse(customer)?.customer) {
      throw new HttpException(
        'Invalid token. Missing customer',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.customerService.findOneByEmail(
      JSON.parse(customer)?.customer?.email,
    );
  }

  async registerCustomer(newCustomer: CustomerDto) {
    const customer = await this.customerService.addCustomer(newCustomer);

    // Emit Customer
    this.customerEvents.emitEvent<Customer>({
      ev: CustomerEvents.CREATED,
      payload: customer,
    });

    return customer;
  }

  async generateAccessToken(genTokenDto: GenTokenDto) {
    const { apps, ...customer } = await this.customerService.findOneByEmail(
      genTokenDto.email,
    );

    if (!customer) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const match = await bcrypt.compare(genTokenDto.password, customer.password);
    if (!match) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = this.encryptCustomerToken(customer);
    return { ...customer, tokens: { accessToken } };
  }

  async signToken(customer: Omit<Customer, 'apps'>) {
    const payload: JwtPayload = {
      customer,
    };
    return sign(payload, this.jwtPrivateKey, {});
  }

  encryptCustomerToken(customer: Omit<Customer, 'apps'>): string {
    const payload: JwtPayload = {
      customer,
    };
    return this.aesEncrypt.encrypt(JSON.stringify(payload));
  }

  encryptAdminToken(admin: Admin): string {
    const payload: AdminJwtPayload = {
      admin,
    };
    return this.aesEncrypt.encrypt(JSON.stringify(payload));
  }

  decryptToken(token: string): string {
    return this.aesEncrypt.decrypt(token);
  }

  async requestCustomerOTP(dto: OtpSignInDto): Promise<void> {
    const customer = await this.customerService.findOneByEmail(dto.email);

    if (!customer) {
      throw new HttpException('Invalid email address.', HttpStatus.BAD_REQUEST);
    }

    const otp = AppService.generateOtp(6);
    customer.otp = parseInt(otp);
    this.customerService.save(customer);

    // send otp
    this.authEvents.emit(
      MailEvents.PUSH_MAIL,
      optMailTemplate(otp, customer.email),
    );
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const customer = await this.customerService.findOneByEmail(
      verifyOtpDto.email,
    );

    if (!customer || (customer && customer.otp != verifyOtpDto.otp)) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    delete customer.apps;
    const accessToken = this.encryptCustomerToken(customer);
    return { ...customer, tokens: { accessToken } };
  }

  async signInAdmin(signAdminToken: SignAdminToken) {
    const admin = await this.adminService.findOneByEmail(signAdminToken.email);

    if (!admin) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!admin.verified) {
      throw new HttpException(
        'You are not a valid admin user',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const match = await bcrypt.compare(signAdminToken.password, admin.password);
    if (!match) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = this.encryptAdminToken(admin);
    return { ...admin, tokens: { accessToken } };
  }
}
