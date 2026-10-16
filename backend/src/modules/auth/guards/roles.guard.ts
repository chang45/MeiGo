import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { JwtPayload } from './jwt-auth.guard';

/**
 * 角色守卫：校验 request.user.role 是否在允许的角色列表中。
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const role = request.user?.role;
    if (!role || !required.includes(role)) {
      throw new ForbiddenException('没有权限执行此操作');
    }
    return true;
  }
}
