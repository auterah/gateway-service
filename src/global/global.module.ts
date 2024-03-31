import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { AuthorizationModule } from 'src/modules/authorization/authorization.module';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService, AuthorizationModule],
  imports: [AuthorizationModule],
  controllers: [],
})
export class GlobalModule {}
