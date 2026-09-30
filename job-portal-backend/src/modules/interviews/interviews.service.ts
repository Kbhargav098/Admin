import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async listInterviews(organizationId: string) {
    return this.prisma.interview.findMany({
      where: { application: { organizationId } },
      include: {
        application: {
          include: {
            job: { select: { title: true } },
            candidate: { include: { user: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async scheduleInterview(data: {
    applicationId: string;
    title: string;
    scheduledAt: string | Date;
    durationMins?: number;
    locationUrl?: string;
    interviewer: string;
  }) {
    const interview = await this.prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        title: data.title,
        scheduledAt: new Date(data.scheduledAt),
        durationMins: data.durationMins || 45,
        locationUrl: data.locationUrl,
        interviewer: data.interviewer,
        status: 'SCHEDULED',
      },
    });

    // Automatically advance application status to 'Interview' if it's currently 'Shortlisted' or 'Applied'
    await this.prisma.application.update({
      where: { id: data.applicationId },
      data: { status: 'Interview' },
    });

    return interview;
  }

  async rescheduleInterview(id: string, scheduledAt: string | Date) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');

    return this.prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
      },
    });
  }

  async cancelInterview(id: string, feedback?: string) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');

    return this.prisma.interview.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        feedback,
      },
    });
  }
}
