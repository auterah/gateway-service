import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import App from './entities/app.entity';
import { AppRequestRepository } from './repositories/app_request.repository';
import AppRequest from './entities/app_request.entity';
import { AppRepository } from './repositories/app.repository';
import { AppRequestService } from './app_request.service';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [TypeOrmModule.forFeature([App, AppRequest]), AuthorizationModule],
  controllers: [AppController],
  providers: [
    AppService,
    AppRepository,
    AppRequestService,
    AppRequestRepository,
  ],
  exports: [AppService],
})
export class AppModule {}
