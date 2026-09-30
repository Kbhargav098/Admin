import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { Role } from '../../src/common/enums/roles.enum';

describe('RBAC Guard Unit Test', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow ORG_SUPER_ADMIN to access billing endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'roles') return [Role.ORG_SUPER_ADMIN];
      return undefined;
    });

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: Role.ORG_SUPER_ADMIN },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should block ORG_ADMIN from billing endpoint (403)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'roles') return [Role.ORG_SUPER_ADMIN];
      return undefined;
    });

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: Role.ORG_ADMIN },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
