import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import Admin from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SettingService } from '../Setting/setting.service';
import Setting from '../Setting/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Setting])],
  providers: [AdminRepository, AdminService, SettingService],
  exports: [AdminRepository, AdminService, SettingService],
  controllers: [AdminController],
})
export class AdminModule {}
