import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class CandidatesService {
  constructor(
    private prisma: PrismaService,
    private tokensService: TokensService,
  ) {}

  async searchCandidates(
    organizationId: string,
    userId: string,
    userRole: string,
    query: { search?: string; skills?: string; location?: string },
  ) {
    // Search page costs 1 token per search operation
    await this.tokensService.deductTokens({
      organizationId,
      userId,
      userRole,
      amount: 1,
      reason: `Candidate search query: '${query.search || 'all'}'`,
    });

    const where: any = {};
    if (query.search) {
      where.OR = [
        { headline: { contains: query.search } },
        { summary: { contains: query.search } },
        { skills: { contains: query.search } },
        { user: { firstName: { contains: query.search } } },
        { user: { lastName: { contains: query.search } } },
      ];
    }
    if (query.location) {
      where.location = { contains: query.location };
    }

    const candidates = await this.prisma.candidate.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        resumes: { take: 1 },
      },
    });

    return candidates;
  }

  async getCandidateDetail(
    organizationId: string,
    userId: string,
    userRole: string,
    candidateId: string,
  ) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        profiles: true,
        resumes: true,
      },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    // Resume/candidate detail view deducts 2 tokens once per candidate per recruiter (idempotent referenceId)
    await this.tokensService.deductTokens({
      organizationId,
      userId,
      userRole,
      amount: 2,
      reason: `View candidate resume detail: ${candidate.user.firstName} ${candidate.user.lastName}`,
      referenceId: `candidate_view_${userId}_${candidateId}`,
    });

    return candidate;
  }

  // Seed / Candidate Portal stub application creation helper
  async createApplication(data: {
    organizationId: string;
    jobId: string;
    candidateId: string;
    notes?: string;
  }) {
    return this.prisma.application.create({
      data: {
        organizationId: data.organizationId,
        jobId: data.jobId,
        candidateId: data.candidateId,
        notes: data.notes,
        status: 'Applied',
        history: {
          create: {
            toStatus: 'Applied',
            reason: 'Application submitted',
          },
        },
      },
      include: { candidate: true, job: true },
    });
  }
}
