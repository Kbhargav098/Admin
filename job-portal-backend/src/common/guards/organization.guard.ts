import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramOrgId = request.params?.organizationId;

    if (!paramOrgId) {
      return true; // route is not org-scoped
    }

    // Platform Super Admin / Admin may bypass tenant checks if needed, but for Org routes user must match org
    if (user?.role === 'PLATFORM_SUPER_ADMIN' || user?.role === 'PLATFORM_ADMIN') {
      return true;
    }

    if (!user || user.organizationId !== paramOrgId) {
      throw new ForbiddenException(
        'Access denied: You are not authorized for this organization',
      );
    }

    return true;
  }
}
