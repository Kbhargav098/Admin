import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  async searchCandidates(query: string, options?: any) {
    this.logger.log(`Searching candidates using DB search fallback for query: '${query}'`);
    const candidates = await this.prisma.candidate.findMany({
      where: query
        ? {
            OR: [
              { headline: { contains: query } },
              { summary: { contains: query } },
              { skills: { contains: query } },
              { user: { firstName: { contains: query } } },
              { user: { lastName: { contains: query } } },
            ],
          }
        : undefined,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        resumes: true,
      },
    });
    return candidates;
  }
}
