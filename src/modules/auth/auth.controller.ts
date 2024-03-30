import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailUtils } from 'src/global/utils/email.utils';
import { CustomerDto } from 'src/modules/customer/dtos/customer.dto';
import { GenTokenDto } from './dtos/generate_token.dto';
import { OtpSignInDto } from './dtos/otp_signin.dto';
import { VerifyOtpDto } from './dtos/veriy_otp.dto';

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
  @Post()
  signToken(@Body() payload: GenTokenDto) {
    return this.authService.generateAccessToken(payload);
  }

  @Get('customer-x-token/:token')
  getCustomerBySignedToken(@Param('token') token: string) {
    return this.authService.getCustomerBySignedToken(token);
  }

  // OTP Sign In
  @Post('2')
  optSignIn(@Body() payload: OtpSignInDto) {
    return this.authService.signInWthOtp(payload);
  }

  // Verify OTP
  @Post('2/verify-otp')
  verifyOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifyOtp(payload);
  }
}
