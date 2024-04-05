import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { AuthorizationModule } from 'src/modules/authorization/authorization.module';
import { AppModule } from 'src/modules/app/app.module';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService, AuthorizationModule, AppModule],
  imports: [AuthorizationModule, AppModule],
  controllers: [],
})
export class GlobalModule {}
