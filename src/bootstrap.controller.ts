import { Controller, Get, Post } from '@nestjs/common';
import { BootService } from './bootstrap.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BootEvents } from './shared/events/local.events';
import { SeedingService } from './database/seeding/seeding.service';

@Controller()
export class BootController {
  constructor(
    private readonly bootService: BootService,
    private readonly seedingService: SeedingService,
    private readonly statusEvents: EventEmitter2,
  ) {}

  @Post('app/init')
  initApp(): string {
    // this.statusEvents.emit(BootEvents.INIT_APP, 'SETUP APP');
    this.seedingService.seedApp();
    return 'Setup in progress... 🚩';
  }

  @Get('status')
  getHealthTalk(): string {
    return this.bootService.exeHealthTalk();
  }
}
