import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import Admin from './admin.entity';
import { AdminService } from './admin.service';
import { SettingService } from '../setting/setting.service';
import Setting from '../setting/setting.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Setting])],
  providers: [AdminRepository, AdminService, SettingService],
  exports: [AdminRepository, AdminService, SettingService],
  controllers: [AdminController],
})
export class AdminModule {}
