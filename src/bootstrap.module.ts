import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { GlobalModule } from './global/global.module';
import { EmailModule } from './modules/email/email.module';
import { AppModule as AppModule__ } from './modules/app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthService } from './modules/auth/auth.service';
import { CustomerModule } from './modules/customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedingModule } from './database/seeding/seeding.module';
import { BootService } from './bootstrap.service';
import { BootController } from './bootstrap.controller';
import { SeedingService } from './database/seeding/seeding.service';
import { SettingModule } from './modules/Setting/setting.module';
import { FileModule } from './modules/file/file.module';
import { BillingModule } from './modules/billing/billing.module';
import { ReportModule } from './modules/report/report.module';
import { ClientModule } from './modules/customer_client/client.module';

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
    EventEmitterModule.forRoot({
      global: true,
    }),
    CustomerModule,
    EmailModule,
    AppModule__,
    AuthModule,
    SettingModule,
    AdminModule,
    SeedingModule,
    FileModule,
    BillingModule,
    ReportModule,
    ClientModule,
  ],
  controllers: [BootController],
  providers: [BootService, AuthService, SeedingService],
})
export class AppModule {}
