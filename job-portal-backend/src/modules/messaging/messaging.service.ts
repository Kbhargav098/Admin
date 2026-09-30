import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async listMessages(organizationId: string) {
    return this.prisma.message.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async sendMessage(organizationId: string, senderId: string, content: string, recipientId?: string) {
    return this.prisma.message.create({
      data: {
        organizationId,
        senderId,
        recipientId,
        content,
      },
    });
  }
}
