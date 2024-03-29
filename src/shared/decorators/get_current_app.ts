import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentApp = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { currentApp } = request;
    return prop ? currentApp?.[prop] : currentApp;
  },
);
