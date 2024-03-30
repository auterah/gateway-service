import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentCustomer = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const currentCustomer = request?.currentCustomer;
    if (!currentCustomer) return null;
    return prop ? currentCustomer?.[prop] : currentCustomer;
  },
);
