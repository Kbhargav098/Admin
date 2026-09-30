import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class OrganizationAdminService {
  constructor(private prisma: PrismaService) {}

  async getAdminData(organizationId: string) {
    return {
      organizationId,
      canManageRecruiters: true,
      canManageJobs: true,
      canAllocateTokens: true,
      canPurchaseTokens: false,
      canManageBilling: false,
    };
  }
}
