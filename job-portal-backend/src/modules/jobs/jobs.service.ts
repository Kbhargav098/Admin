import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private tokensService: TokensService,
  ) {}

  async getCostPreview() {
    return {
      cost: 10,
      currency: 'tokens',
      description: 'Job posting cost: 10 tokens per job',
    };
  }

  async listJobs(
    organizationId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      department?: string;
    },
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };

    if (query.status) {
      where.status = query.status;
    }
    if (query.department) {
      where.department = query.department;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { location: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          skills: true,
          _count: { select: { applications: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJob(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
      include: {
        skills: true,
        _count: { select: { applications: true } },
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async createJob(
    organizationId: string,
    userId: string,
    userRole: string,
    data: {
      title: string;
      description: string;
      department?: string;
      location: string;
      employmentType?: string;
      experienceMin?: number;
      experienceMax?: number;
      salaryMin?: number;
      salaryMax?: number;
      skills?: string[];
    },
  ) {
    const cost = 10;

    // Deduct tokens atomically before creating job
    await this.tokensService.deductTokens({
      organizationId,
      userId,
      userRole,
      amount: cost,
      reason: `Job posting: ${data.title}`,
    });

    const job = await this.prisma.job.create({
      data: {
        organizationId,
        createdById: userId,
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType || 'FULL_TIME',
        experienceMin: data.experienceMin ?? 0,
        experienceMax: data.experienceMax ?? 10,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        tokenCost: cost,
        skills: data.skills
          ? { create: data.skills.map((s) => ({ name: s })) }
          : undefined,
      },
      include: { skills: true },
    });

    return job;
  }

  async updateJob(organizationId: string, jobId: string, data: any) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
    });
    if (!job) throw new NotFoundException('Job not found');

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        experienceMin: data.experienceMin,
        experienceMax: data.experienceMax,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        status: data.status,
      },
      include: { skills: true },
    });
  }

  async closeJob(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
    });
    if (!job) throw new NotFoundException('Job not found');

    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: 'CLOSED' },
    });
  }

  async deleteJob(organizationId: string, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, organizationId },
    });
    if (!job) throw new NotFoundException('Job not found');

    return this.prisma.job.delete({
      where: { id: jobId },
    });
  }
}
