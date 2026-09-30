import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const settings = org.settings ? JSON.parse(org.settings) : {};
    return {
      organizationId,
      name: org.name,
      description: org.description,
      website: org.website,
      industry: org.industry,
      size: org.size,
      location: org.location,
      logoUrl: org.logoUrl,
      settings: {
        jobPostCost: settings.jobPostCost || 10,
        resumeViewCost: settings.resumeViewCost || 2,
        searchCost: settings.searchCost || 1,
        emailNotifications: settings.emailNotifications ?? true,
        ...settings,
      },
    };
  }

  async updateSettings(organizationId: string, data: any) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const currentSettings = org.settings ? JSON.parse(org.settings) : {};
    const updatedSettings = { ...currentSettings, ...data };

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        settings: JSON.stringify(updatedSettings),
      },
    });

    return this.getSettings(organizationId);
  }
}
