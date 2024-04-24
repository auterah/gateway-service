import { Body, Controller, Get, Post } from '@nestjs/common';
import { BootService } from './bootstrap.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SeedingService } from './database/seeding/seeding.service';
import { SmtpDto } from './dtos/smtp.dto';
import { SettingEvents } from './shared/events/setting.events';

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

  @Post('add-smtp')
  addSMTPConfigs(@Body() smtpDto: SmtpDto): string {
    this.statusEvents.emit(SettingEvents.ADD_SMTP_CONFIG, smtpDto);
    return 'Adding SMTP...';
  }
}
