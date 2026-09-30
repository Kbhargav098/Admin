import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async listNotifications(organizationId: string, userId: string) {
    return this.prisma.notification.findMany({
      where: {
        organizationId,
        OR: [{ userId }, { userId: null }],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(organizationId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllRead(organizationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        organizationId,
        OR: [{ userId }, { userId: null }],
      },
      data: { isRead: true },
    });
  }

  async createNotification(data: {
    organizationId: string;
    userId?: string;
    title: string;
    message: string;
    type?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
      },
    });
  }
}
