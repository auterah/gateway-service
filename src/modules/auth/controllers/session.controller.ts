import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Headers,
  UseGuards,
  Query,
  Delete,
  Ip,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { AdminGuard } from '../guards/admin_guard';

@Controller('sessions')
export class SessionController {
  constructor(private authService: AuthService) {}

  // Get X Session
  @Get('session-x-id/:session_id')
  getCustomerBySignedToken(
    @Param('session_id') sessionId: string,
    @Req() { headers }: Request,
  ) {
    const authorization = headers.authorization;
    if (authorization !== '%x-session/:sessionId%') {
      throw new HttpException('Access denied!', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.findSessionById(sessionId);
  }

  // Login Sessions
  @Get()
  @UseGuards(AdminGuard)
  getLoginSessions(@Query() queries: FindDataRequestDto) {
    return this.authService.fetchLoginSessions(queries);
  }

  // Logout
  @Delete('id/:session_id')
  deleteLoginSessions(@Param('session_id') sessionId: string) {
    return this.authService.logoutSession(sessionId);
  }
}
