import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerDto } from 'src/modules/customer/dtos/customer.dto';
import { OtpSignInDto } from './dtos/otp_signin.dto';
import { VerifyOtpDto } from './dtos/veriy_otp.dto';
import { ActionsGuard } from './guards/actions_guard';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import { SignAdminToken } from './dtos/sign_admin_token.dto';
import { EmailUtils } from 'src/shared/utils/email.utils';
import { CustomerService } from '../customer/services/customer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
  ) {}

  // register customer
  @Post('register')
  async addCustomer(@Body() newCustomer: CustomerDto) {
    if (!(await EmailUtils.validateEmail(newCustomer.email))) {
      throw new HttpException(
        'Invalid email address',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return this.authService.registerCustomer(newCustomer);
  }

  // sign user token
  // @Post()
  // signToken(@Body() payload: GenTokenDto) {
  //   return this.authService.generateAccessToken(payload);
  // }

  @Get('customer-x-token/:token')
  getCustomerBySignedToken(@Param('token') token: string) {
    return this.authService.getCustomerBySignedToken(token);
  }

  // Request customer OTP
  @Post('2')
  async requestCustomerOTP(@Body() payload: OtpSignInDto) {
    await this.authService.requestCustomerOTP(payload);
    return `Kindly check your mailbox for the OTP`;
  }

  // Verify Customer OTP
  @Post('2/verify-otp')
  verifyCustomerOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifyCustomerOtp(payload);
  }

  // Get Customer Info.
  @Get('me')
  @UseGuards(ActionsGuard)
  getCustomerInfo(@GetCurrentCustomer('id') customerId: string) {
    return this.customerService.findOne({
      where: { id: customerId },
      relations: ['tags'],
    });
  }

  // Request admin OTP
  @Post('admin')
  requestSuperadminOTP(@Body() payload: SignAdminToken) {
    return this.authService.requestSuperadminOTP(payload);
  }

  // Verify OTP
  @Post('admin/verify-otp')
  verifySuperadminOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifySuperadminOtp(payload);
  }
}
