import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import Setting from './entities/setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetRepository } from './repositories/target.repository';
import Target from './entities/target.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Target])],
  providers: [SettingService, TargetRepository, EventEmitter2],
  exports: [SettingService],
})
export class SettingModule {}
