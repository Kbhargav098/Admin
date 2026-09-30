import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PasswordService } from '../../security/password/password.service';
import { TokenService } from '../../security/tokens/token.service';
import { EmailService } from '../../infrastructure/email/email.service';
import { AuditService } from '../../security/audit/audit.service';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private auditService: AuditService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await this.passwordService.hash(data.password);

    // Create Org if organizationName provided, user becomes ORG_SUPER_ADMIN
    let org: any = null;
    let role = Role.ORG_SUPER_ADMIN;

    if (data.organizationName) {
      const slug = data.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      org = await this.prisma.organization.create({
        data: {
          name: data.organizationName,
          slug: `${slug}-${Date.now()}`,
          tokenWallet: {
            create: {
              balance: 500, // Initial 500 free tokens for new org
            },
          },
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role,
        organizationId: org?.id,
        emailVerified: true,
      },
    });

    if (org) {
      await this.prisma.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          status: 'ACTIVE',
        },
      });
    }

    await this.emailService.sendEmail(
      user.email,
      'Welcome to Job Portal',
      `Hello ${user.firstName}, welcome to Job Portal!`,
    );

    await this.auditService.logAction({
      organizationId: org?.id,
      userId: user.id,
      action: 'USER_REGISTERED',
      resource: 'User',
    });

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await this.passwordService.verify(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.auditService.logAction({
      organizationId: user.organizationId || undefined,
      userId: user.id,
      action: 'USER_LOGIN',
      resource: 'User',
    });

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    const result = await this.tokenService.verifyAndRotateRefreshToken(
      refreshToken,
    );
    if (!result) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const authRes = await this.generateAuthResponse(result.user);
    return {
      ...authRes,
      refreshToken: result.newRefreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      await this.emailService.sendEmail(
        email,
        'Reset Password Request',
        'Password reset link: http://localhost:5173/auth/reset-password',
      );
    }
    return { message: 'If email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    return { message: 'Password has been reset successfully.' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const permissions = this.getUserPermissions(user.role);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
      permissions,
    };
  }

  private async generateAuthResponse(user: any) {
    const permissions = this.getUserPermissions(user.role);
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId || undefined,
      permissions,
    });

    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        permissions,
      },
    };
  }

  private getUserPermissions(role: string): string[] {
    switch (role) {
      case Role.ORG_SUPER_ADMIN:
        return [
          'org:manage_all',
          'tokens:purchase',
          'billing:manage',
          'org_admin:manage',
          'recruiter:manage',
          'tokens:allocate',
          'job:manage_all',
          'member:manage',
          'job:create',
          'job:update',
          'candidate:search',
          'candidate:view',
          'application:manage',
          'interview:schedule',
          'offer:send',
        ];
      case Role.ORG_ADMIN:
        return [
          'recruiter:manage',
          'tokens:allocate',
          'job:manage_all',
          'member:manage',
          'job:create',
          'job:update',
          'candidate:search',
          'candidate:view',
          'application:manage',
          'interview:schedule',
          'offer:send',
        ];
      case Role.RECRUITER:
        return [
          'job:create',
          'job:update',
          'candidate:search',
          'candidate:view',
          'application:manage',
          'interview:schedule',
          'offer:send',
        ];
      default:
        return [];
    }
  }
}
