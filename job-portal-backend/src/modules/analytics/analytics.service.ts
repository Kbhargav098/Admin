import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(organizationId: string, userId: string, role: string) {
    const [
      activeJobsCount,
      totalApplicationsCount,
      interviewsCount,
      offersCount,
      hiredCount,
      wallet,
      statusGroup,
    ] = await Promise.all([
      this.prisma.job.count({ where: { organizationId, status: 'OPEN' } }),
      this.prisma.application.count({ where: { organizationId } }),
      this.prisma.interview.count({
        where: { application: { organizationId }, status: 'SCHEDULED' },
      }),
      this.prisma.offer.count({
        where: { application: { organizationId } },
      }),
      this.prisma.application.count({
        where: { organizationId, status: 'Hired' },
      }),
      this.prisma.tokenWallet.findUnique({ where: { organizationId } }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { id: true },
      }),
    ]);

    // Format hiring funnel data
    const statusCounts: Record<string, number> = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
      Rejected: 0,
    };
    statusGroup.forEach((g) => {
      statusCounts[g.status] = g._count.id;
    });

    const funnel = [
      { stage: 'Applied', count: statusCounts['Applied'] || 0 },
      { stage: 'Shortlisted', count: statusCounts['Shortlisted'] || 0 },
      { stage: 'Interview', count: statusCounts['Interview'] || 0 },
      { stage: 'Offer', count: statusCounts['Offer'] || 0 },
      { stage: 'Hired', count: statusCounts['Hired'] || 0 },
    ];

    // Mock trend over time for charts
    const applicationsTrend = [
      { month: 'Jan', applications: Math.round(totalApplicationsCount * 0.1) },
      { month: 'Feb', applications: Math.round(totalApplicationsCount * 0.15) },
      { month: 'Mar', applications: Math.round(totalApplicationsCount * 0.2) },
      { month: 'Apr', applications: Math.round(totalApplicationsCount * 0.25) },
      { month: 'May', applications: Math.round(totalApplicationsCount * 0.3) },
    ];

    return {
      stats: {
        activeJobs: activeJobsCount,
        totalApplications: totalApplicationsCount,
        interviewsScheduled: interviewsCount,
        offersExtended: offersCount,
        hired: hiredCount,
        tokenBalance: wallet ? wallet.balance : 0,
      },
      funnel,
      applicationsTrend,
    };
  }
}
