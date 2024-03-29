import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppService } from 'src/modules/app/app.service';
import { CustomerService } from 'src/modules/customer/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly customerService: CustomerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtConstants.secret',
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const customer = await this.customerService.findOneByEmail(
      payload.customer.email,
    );
    if (!customer) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, customer, payload.iat);
  }
}
