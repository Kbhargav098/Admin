import { describe, it, expect } from 'vitest';
import { mockSuperAdminUser, mockRecruiterUser } from '../fixtures/mock-store';

describe('Permissions Unit Test', () => {
  it('should verify ORG_SUPER_ADMIN has billing manage permission', () => {
    expect(mockSuperAdminUser.permissions).toContain('billing:manage');
  });

  it('should verify RECRUITER does not have billing manage permission', () => {
    expect(mockRecruiterUser.permissions).not.toContain('billing:manage');
  });
});
