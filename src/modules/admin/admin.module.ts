import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import Admin from './admin.entity';
import { AdminService } from './admin.service';
import { SettingService } from '../Setting/setting.service';
import Setting from '../Setting/entities/setting.entity';
import { AdminController } from './admin.controller';
import { TargetRepository } from '../Setting/repositories/target.repository';
import Target from '../Setting/entities/target.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Setting, Target])],
  providers: [AdminRepository, AdminService, SettingService, TargetRepository],
  exports: [AdminRepository, AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
