import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Role check
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role as Role);
      if (!hasRole) {
        throw new ForbiddenException(
          `Insufficient role permissions. Required: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // Permission check
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions: string[] = user.permissions || [];
      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException(
          `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }
}
