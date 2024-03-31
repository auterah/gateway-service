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
import { EmailUtils } from 'src/global/utils/email.utils';
import { CustomerDto } from 'src/modules/customer/dtos/customer.dto';
import { GenTokenDto } from './dtos/generate_token.dto';
import { OtpSignInDto } from './dtos/otp_signin.dto';
import { VerifyOtpDto } from './dtos/veriy_otp.dto';
import { ActionsGuard } from './guards/actions_guard';
import { GetCurrentCustomer } from 'src/shared/decorators/get_current_customer';
import Customer from '../customer/customer.entity';
import { SignAdminToken } from './dtos/sign_admin_token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  requestCustomerOTP(@Body() payload: OtpSignInDto) {
    return this.authService.requestCustomerOTP(payload);
  }

  // Verify Customer OTP
  @Post('2/verify-otp')
  verifyCustomerOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifyCustomerOtp(payload);
  }

  // Get Customer Info.
  @Get('me')
  @UseGuards(ActionsGuard)
  getCustomerInfo(@GetCurrentCustomer() customer: Customer) {
    return customer;
  }

  // Sign Admin token.
  @Post('admin')
  signInAdmin(@Body() payload: SignAdminToken) {
    return this.authService.signInAdmin(payload);
  }

  // Verify OTP
  @Post('admin/verify-otp')
  verifyAdminOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifyAdminOtp(payload);
  }
}
