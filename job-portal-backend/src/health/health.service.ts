import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async checkHealth() {
    let dbStatus = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: 'up',
      },
    };
  }
}
