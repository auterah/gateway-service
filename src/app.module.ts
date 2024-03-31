import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { GlobalModule } from './global/global.module';
import { EmailModule } from './modules/email/email.module';
import { AppModule as AppModule__ } from './modules/app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { EvemitterModule } from './shared/evemitter/evemitter.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthService } from './modules/auth/auth.service';
import { CustomerModule } from './modules/customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { SettingModule } from './modules/Setting/setting.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    GlobalModule,
    DatabaseModule,
    EvemitterModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    CustomerModule,
    EmailModule,
    AppModule__,
    AuthModule,
    SettingModule,
    AdminModule,
  ],
  controllers: [StatusController],
  providers: [StatusService, AuthService],
})
export class AppModule {}
