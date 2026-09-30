import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { Role } from '../../common/enums/roles.enum';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Injectable()
export class RecruitersService {
  constructor(private prisma: PrismaService) {}

  async listRecruiters(organizationId: string) {
    const members = await this.prisma.organizationMember.findMany({
      where: {
        organizationId,
        user: { role: Role.RECRUITER },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    const allocations = await this.prisma.tokenAllocation.findMany({
      where: { organizationId },
    });

    return members.map((m) => {
      const alloc = allocations.find((a) => a.userId === m.userId);
      return {
        id: m.id,
        userId: m.userId,
        recruiterType: m.recruiterType || 'HR_RECRUITER',
        status: m.status,
        user: m.user,
        tokenAllocation: alloc
          ? { allocated: alloc.allocated, used: alloc.used, remaining: alloc.allocated - alloc.used }
          : { allocated: 0, used: 0, remaining: 0 },
      };
    });
  }

  async createRecruiter(
    organizationId: string,
    data: { email: string; firstName: string; lastName: string; recruiterType?: string },
  ) {
    let user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      const passwordHash = await CryptoUtil.hashPassword('Demo@1234');
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: Role.RECRUITER,
          organizationId,
          emailVerified: true,
        },
      });
    }

    const member = await this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        recruiterType: data.recruiterType || 'HR_RECRUITER',
        status: 'ACTIVE',
      },
      include: { user: true },
    });

    return member;
  }

  async updateRecruiterRole(
    organizationId: string,
    recruiterId: string,
    recruiterType: string,
  ) {
    const member = await this.prisma.organizationMember.findFirst({
      where: { id: recruiterId, organizationId },
    });
    if (!member) throw new NotFoundException('Recruiter not found');

    return this.prisma.organizationMember.update({
      where: { id: recruiterId },
      data: { recruiterType },
      include: { user: true },
    });
  }
}
