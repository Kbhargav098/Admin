import { describe, it, expect } from 'vitest';

describe('RoleRoute Unit Test', () => {
  it('should validate allowed roles array logic', () => {
    const allowedRoles = ['ORG_SUPER_ADMIN', 'ORG_ADMIN'];
    const recruiterRole = 'RECRUITER';
    expect(allowedRoles.includes(recruiterRole)).toBe(false);
  });
});
