import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async logAction(data: {
    organizationId?: string;
    userId?: string;
    action: string;
    resource: string;
    ipAddress?: string;
    details?: any;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          organizationId: data.organizationId,
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          ipAddress: data.ipAddress,
          details: data.details ? JSON.stringify(data.details) : undefined,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to create audit log: ${e.message}`);
    }
  }
}
