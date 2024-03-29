import { Module } from '@nestjs/common';
import { EvemitterService } from './evemitter.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [EvemitterService],
  exports: [EvemitterService],
  imports: [EventEmitterModule],
})
export class EvemitterModule {}
