import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OrganizationGuard } from '../../src/common/guards/organization.guard';
import { Reflector } from '@nestjs/core';

describe('Tenant Isolation Unit Test', () => {
  let guard: OrganizationGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    guard = new OrganizationGuard(reflector);
  });

  it('should allow user accessing their own organization data', () => {
    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'u1', organizationId: 'org_acme_1001', role: 'RECRUITER' },
          params: { organizationId: 'org_acme_1001' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException 403 on cross-tenant access attempt', () => {
    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'u1', organizationId: 'org_acme_1001', role: 'RECRUITER' },
          params: { organizationId: 'org_globex_2002' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
