import { Controller, Get, Post } from '@nestjs/common';
import { BootService } from './bootstrap.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BootEvents } from './shared/events/local.events';

@Controller()
export class BootController {
  constructor(
    private readonly bootService: BootService,
    private readonly statusEvents: EventEmitter2,
  ) {}

  @Post('app/init')
  initApp(): string {
    this.statusEvents.emit(BootEvents.INIT_APP, 'SETUP APP');
    return 'Setup in progress... 🚩';
  }

  // @Get('status')
  // getHealthTalk(): string {
  //   return this.bootService.exeHealthTalk();
  // }
}
