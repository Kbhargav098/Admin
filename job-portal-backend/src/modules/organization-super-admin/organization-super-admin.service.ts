import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class OrganizationSuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getSuperAdminData(organizationId: string) {
    return {
      organizationId,
      fullOrgAccess: true,
      canPurchaseTokens: true,
      canManageBilling: true,
      canCreateOrgAdmins: true,
    };
  }
}
