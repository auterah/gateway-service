import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { AuthorizationModule } from 'src/modules/authorization/authorization.module';
import { AppModule } from 'src/modules/app/app.module';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService, AuthorizationModule, AppModule],
  imports: [AuthorizationModule, AppModule, ScheduleModule.forRoot()],
  controllers: [],
})
export class GlobalModule {}
