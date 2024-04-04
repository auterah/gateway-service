import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import Admin from './admin.entity';
import { AdminService } from './admin.service';
import { SettingService } from '../setting/setting.service';
import { SettingRepository } from '../setting/setting.repository';
import Setting from '../setting/setting.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Setting])],
  providers: [AdminRepository, AdminService, SettingService, SettingRepository],
  exports: [AdminRepository, AdminService, SettingService, SettingRepository],
  controllers: [AdminController],
})
export class AdminModule {}
