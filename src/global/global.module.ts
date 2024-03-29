import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EvemitterModule } from 'src/shared/evemitter/evemitter.module';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService, EvemitterModule],
  imports: [EvemitterModule],
  controllers: [],
})
export class GlobalModule {}
