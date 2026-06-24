import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SupplierPrincipal } from '../../modules/supplier-auth/strategies/supplier-jwt.strategy';

export const CurrentSupplier = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SupplierPrincipal => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
