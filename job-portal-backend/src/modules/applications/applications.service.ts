import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AppGateway } from '../../infrastructure/websocket/app.gateway';

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  Applied: ['Shortlisted', 'Rejected'],
  Shortlisted: ['Interview', 'Rejected'],
  Interview: ['Offer', 'Rejected', 'Shortlisted'],
  Offer: ['Hired', 'Rejected', 'Interview'],
  Hired: [],
  Rejected: ['Applied', 'Shortlisted', 'Interview'],
};

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private appGateway: AppGateway,
  ) {}

  async listApplications(
    organizationId: string,
    query: { jobId?: string; status?: string; search?: string },
  ) {
    const where: any = { organizationId };

    if (query.jobId) where.jobId = query.jobId;
    if (query.status) where.status = query.status;

    const applications = await this.prisma.application.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        job: { select: { id: true, title: true, department: true } },
        candidate: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            resumes: true,
          },
        },
        interviews: true,
        offers: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    return applications;
  }

  async getApplication(organizationId: string, applicationId: string) {
    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, organizationId },
      include: {
        job: true,
        candidate: {
          include: {
            user: true,
            resumes: true,
            profiles: true,
          },
        },
        interviews: { orderBy: { scheduledAt: 'asc' } },
        offers: { orderBy: { createdAt: 'desc' } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(
    organizationId: string,
    applicationId: string,
    userId: string,
    newStatus: string,
    reason?: string,
  ) {
    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, organizationId },
    });
    if (!app) throw new NotFoundException('Application not found');

    const allowed = VALID_STATUS_TRANSITIONS[app.status] || [];
    if (!allowed.includes(newStatus) && app.status !== newStatus) {
      throw new BadRequestException(
        `Invalid status transition from '${app.status}' to '${newStatus}'. Allowed: ${allowed.join(', ')}`,
      );
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        history: {
          create: {
            fromStatus: app.status,
            toStatus: newStatus,
            changedById: userId,
            reason,
          },
        },
      },
      include: {
        job: true,
        candidate: { include: { user: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    // Emit real-time WebSocket event to organization room
    this.appGateway.emitToOrg(organizationId, 'applicationStatusUpdated', {
      applicationId,
      jobId: app.jobId,
      candidateName: `${updated.candidate.user.firstName} ${updated.candidate.user.lastName}`,
      fromStatus: app.status,
      toStatus: newStatus,
    });

    return updated;
  }

  async updateNotes(organizationId: string, applicationId: string, notes: string) {
    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, organizationId },
    });
    if (!app) throw new NotFoundException('Application not found');

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { notes },
    });
  }
}
