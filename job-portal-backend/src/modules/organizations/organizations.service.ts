import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganization(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        tokenWallet: true,
      },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateOrganization(organizationId: string, data: any) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industry,
        size: data.size,
        location: data.location,
        logoUrl: data.logoUrl,
        settings: data.settings ? JSON.stringify(data.settings) : undefined,
      },
    });
  }
}
