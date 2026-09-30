import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class OrganizationRolesService {
  constructor(private prisma: PrismaService) {}

  async listRoles(organizationId: string) {
    return this.prisma.organizationRole.findMany({
      where: { organizationId },
      include: { permissions: { include: { permission: true } } },
    });
  }
}
