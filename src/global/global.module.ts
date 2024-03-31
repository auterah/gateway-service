import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EvemitterModule } from 'src/shared/evemitter/evemitter.module';
import { AuthorizationModule } from 'src/modules/authorization/authorization.module';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService, EvemitterModule, AuthorizationModule],
  imports: [EvemitterModule, AuthorizationModule],
  controllers: [],
})
export class GlobalModule {}
