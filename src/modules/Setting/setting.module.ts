import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import Setting from './setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingRepository } from './setting.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [SettingService, SettingRepository, EventEmitter2],
  exports: [SettingService, SettingRepository, EventEmitter2],
})
export class SettingModule {}
