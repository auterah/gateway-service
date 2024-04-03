import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentApp = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const currentApp = request?.currentApp;
    if (!currentApp) return null;
    return prop ? currentApp?.[prop] : currentApp;
  },
);