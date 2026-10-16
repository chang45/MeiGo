import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../guards/jwt-auth.guard';

/**
 * 从 request.user 中取出 JWT 载荷。
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
  return request.user as JwtPayload;
});
