import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InsufficientTokensException } from '../../common/errors/custom.error';

@Injectable()
export class TokensService {
  constructor(private prisma: PrismaService) {}

  async getBalance(organizationId: string) {
    let wallet = await this.prisma.tokenWallet.findUnique({
      where: { organizationId },
    });
    if (!wallet) {
      wallet = await this.prisma.tokenWallet.create({
        data: { organizationId, balance: 100 },
      });
    }
    return wallet;
  }

  async getAllocations(organizationId: string) {
    return this.prisma.tokenAllocation.findMany({
      where: { organizationId },
    });
  }

  async getTransactions(organizationId: string) {
    return this.prisma.tokenTransaction.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async allocateTokens(
    organizationId: string,
    recruiterId: string,
    amount: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.tokenWallet.findUnique({
        where: { organizationId },
      });
      if (!wallet || wallet.balance < amount) {
        throw new InsufficientTokensException('Organization token wallet balance is insufficient for allocation');
      }

      const updatedWallet = await tx.tokenWallet.update({
        where: { organizationId },
        data: { balance: { decrement: amount } },
      });

      const allocation = await tx.tokenAllocation.upsert({
        where: { organizationId_userId: { organizationId, userId: recruiterId } },
        create: { organizationId, userId: recruiterId, allocated: amount, used: 0 },
        update: { allocated: { increment: amount } },
      });

      await tx.tokenTransaction.create({
        data: {
          organizationId,
          userId: recruiterId,
          type: 'ALLOCATE',
          amount,
          reason: `Allocated ${amount} tokens to recruiter`,
          balanceAfter: updatedWallet.balance,
        },
      });

      return allocation;
    });
  }

  async deductTokens(data: {
    organizationId: string;
    userId: string;
    userRole: string;
    amount: number;
    reason: string;
    referenceId?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Check idempotency if referenceId provided
      if (data.referenceId) {
        const existingTx = await tx.tokenTransaction.findFirst({
          where: {
            organizationId: data.organizationId,
            referenceId: data.referenceId,
            type: 'DEBIT',
          },
        });
        if (existingTx) {
          return { success: true, idempotent: true };
        }
      }

      // If user is Recruiter, deduct from recruiter allocation first if exists
      if (data.userRole === 'RECRUITER') {
        const allocation = await tx.tokenAllocation.findUnique({
          where: {
            organizationId_userId: {
              organizationId: data.organizationId,
              userId: data.userId,
            },
          },
        });

        if (allocation && allocation.allocated - allocation.used >= data.amount) {
          await tx.tokenAllocation.update({
            where: { id: allocation.id },
            data: { used: { increment: data.amount } },
          });

          const wallet = await tx.tokenWallet.findUnique({
            where: { organizationId: data.organizationId },
          });

          await tx.tokenTransaction.create({
            data: {
              organizationId: data.organizationId,
              userId: data.userId,
              type: 'DEBIT',
              amount: data.amount,
              reason: data.reason,
              referenceId: data.referenceId,
              balanceAfter: wallet ? wallet.balance : 0,
            },
          });

          return { success: true };
        }
      }

      // Otherwise deduct directly from org wallet
      const wallet = await tx.tokenWallet.findUnique({
        where: { organizationId: data.organizationId },
      });

      if (!wallet || wallet.balance < data.amount) {
        throw new InsufficientTokensException(
          `Insufficient token balance. Action '${data.reason}' requires ${data.amount} tokens.`,
        );
      }

      const updatedWallet = await tx.tokenWallet.update({
        where: { organizationId: data.organizationId },
        data: { balance: { decrement: data.amount } },
      });

      await tx.tokenTransaction.create({
        data: {
          organizationId: data.organizationId,
          userId: data.userId,
          type: 'DEBIT',
          amount: data.amount,
          reason: data.reason,
          referenceId: data.referenceId,
          balanceAfter: updatedWallet.balance,
        },
      });

      return { success: true };
    });
  }

  async creditTokens(
    organizationId: string,
    amount: number,
    reason: string,
    userId?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.tokenWallet.upsert({
        where: { organizationId },
        create: { organizationId, balance: amount },
        update: { balance: { increment: amount } },
      });

      await tx.tokenTransaction.create({
        data: {
          organizationId,
          userId,
          type: 'CREDIT',
          amount,
          reason,
          balanceAfter: updatedWallet.balance,
        },
      });

      return updatedWallet;
    });
  }
}
