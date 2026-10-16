import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * 声明访问某接口所需的角色。
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
