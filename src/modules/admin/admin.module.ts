import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import Admin from './admin.entity';
import { AdminService } from './admin.service';
import { SettingService } from '../Setting/setting.service';
import { SettingRepository } from '../Setting/setting.repository';
import Setting from '../Setting/setting.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Setting])],
  providers: [AdminRepository, AdminService, SettingService, SettingRepository],
  exports: [AdminRepository, AdminService, SettingService, SettingRepository],
  controllers: [AdminController],
})
export class AdminModule {}
