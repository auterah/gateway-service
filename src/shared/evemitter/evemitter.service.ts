import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { MqttService } from 'src/messaging/mqtt/mqtt.service';
import { EmitEvent, IEvemitterService } from './interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EvemitterService<P>
  extends EventEmitter
  implements IEvemitterService<P>
{
  constructor(private event: EventEmitter2) {
    super();
  }

  onModuleInit() {
    // You can initialize your event emitter here if needed
  }

  emitEvent<P>(evOpts: EmitEvent<P>): void {
    this.event.emit(evOpts.ev, this.prepEv(evOpts));
  }

  private prepEv<P>(evOpts: EmitEvent<P>) {
    return evOpts.payload;
  }
}
