import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
    organizationId?: string;
    permissions: string[];
  }): Promise<string> {
    const secret = this.configService.get<string>(
      'auth.accessSecret',
      'super-secret-jwt-access-key-for-job-portal',
    );
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = CryptoUtil.generateRandomToken(40);
    const tokenHash = CryptoUtil.hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  async verifyAndRotateRefreshToken(rawToken: string) {
    if (!rawToken) return null;
    const tokenHash = CryptoUtil.hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existing || existing.isRevoked || existing.expiresAt < new Date()) {
      return null;
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { isRevoked: true },
    });

    // Create new refresh token
    const newRawToken = await this.generateRefreshToken(existing.userId);
    return {
      user: existing.user,
      newRefreshToken: newRawToken,
    };
  }
}
