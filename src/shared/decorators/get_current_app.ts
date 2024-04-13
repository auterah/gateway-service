import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  createParamDecorator,
} from '@nestjs/common';

export const GetCurrentApp = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!('currentApp' in request)) {
      Logger.error(
        'Error occurred because controller is missing @UseGuards(ActionsGuard)',
      );
      throw new HttpException(
        'Error getting current app',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const currentApp = request?.currentApp;
    if (!currentApp) return null;
    return prop ? currentApp?.[prop] : currentApp;
  },
);
