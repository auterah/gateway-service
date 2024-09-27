import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy';
import { configs } from 'config/config.env';
import { AdminModule } from '../admin/admin.module';
import LoginSession from './entities/login_session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginSessionRepository } from './repositories/login_session.repository';
import { SessionController } from './controllers/session.controller';

@Module({
  controllers: [AuthController, SessionController],
  providers: [JwtService, JwtStrategy, AuthService, LoginSessionRepository],
  exports: [JwtService, JwtStrategy, AuthService, LoginSessionRepository],
  imports: [
    TypeOrmModule.forFeature([LoginSession]),
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
