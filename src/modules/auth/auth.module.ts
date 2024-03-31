import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy';
import { configs } from 'config/config.env';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [AuthController],
  providers: [JwtService, JwtStrategy, AuthService],
  exports: [JwtService, JwtStrategy, AuthService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configs.JWT_SECRET, // Make sure to use your actual secret
      signOptions: { expiresIn: '60s' },
    }),
    CustomerModule,
    AdminModule,
  ],
})
export class AuthModule {}
