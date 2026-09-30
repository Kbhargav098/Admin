import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { EmailService } from '../../infrastructure/email/email.service';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class OrganizationMembersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async listMembers(organizationId: string) {
    return this.prisma.organizationMember.findMany({
      where: { organizationId },
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
  }

  async inviteMember(
    organizationId: string,
    data: { email: string; role: string; recruiterType?: string },
    currentRole: string,
  ) {
    if (data.role === Role.ORG_SUPER_ADMIN && currentRole !== Role.ORG_SUPER_ADMIN) {
      throw new ForbiddenException('Only Org Super Admin can create Org Super Admin users');
    }
    if (data.role === Role.ORG_ADMIN && currentRole !== Role.ORG_SUPER_ADMIN) {
      throw new ForbiddenException('Only Org Super Admin can create Org Admin users');
    }

    const inviteToken = CryptoUtil.generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId,
        email: data.email,
        role: data.role,
        recruiterType: data.recruiterType,
        token: inviteToken,
        expiresAt,
      },
    });

    await this.emailService.sendEmail(
      data.email,
      'Organization Invitation',
      `You have been invited to join the organization. Accept link: http://localhost:5173/auth/accept-invite?token=${inviteToken}`,
    );

    return invitation;
  }

  async updateMemberRole(
    organizationId: string,
    memberId: string,
    newRole: string,
    recruiterType?: string,
  ) {
    const member = await this.prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId },
      include: { user: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    await this.prisma.user.update({
      where: { id: member.userId },
      data: { role: newRole },
    });

    return this.prisma.organizationMember.update({
      where: { id: memberId },
      data: { recruiterType },
      include: { user: true },
    });
  }

  async removeMember(organizationId: string, memberId: string) {
    const member = await this.prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId },
    });
    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.organizationMember.delete({
      where: { id: memberId },
    });
  }

  async acceptInvite(token: string, password?: string, firstName?: string, lastName?: string) {
    const invite = await this.prisma.invitation.findUnique({
      where: { token },
    });
    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    let user = await this.prisma.user.findUnique({ where: { email: invite.email } });
    if (!user) {
      if (!password || !firstName || !lastName) {
        throw new BadRequestException('User details required for new user registration');
      }
      const passwordHash = await CryptoUtil.hashPassword(password);
      user = await this.prisma.user.create({
        data: {
          email: invite.email,
          passwordHash,
          firstName,
          lastName,
          role: invite.role,
          organizationId: invite.organizationId,
          emailVerified: true,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { organizationId: invite.organizationId, role: invite.role },
      });
    }

    await this.prisma.organizationMember.create({
      data: {
        organizationId: invite.organizationId,
        userId: user.id,
        recruiterType: invite.recruiterType,
        status: 'ACTIVE',
      },
    });

    await this.prisma.invitation.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    });

    return { success: true, message: 'Invitation accepted successfully' };
  }
}
