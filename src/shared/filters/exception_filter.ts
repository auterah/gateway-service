import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let message: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const report = message && message?.error;

    if (message && typeof message != 'string') {
      message = message?.response || message?.message;
    }

    const logData = {
      statusCode,
      status: 'Failed',
      message,
      report,
      time: new Date().toISOString(),
      method: request.method,
      path: request.url,
    };

    this.logger.error('================= Caught Exception ==================');
    console.error({
      ...logData,
      exception,
    });
    this.logger.error('================= Caught Exception ==================');

    response.status(statusCode).json(logData);
  }
}
