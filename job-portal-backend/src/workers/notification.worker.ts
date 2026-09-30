import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationWorker {
  private readonly logger = new Logger(NotificationWorker.name);

  async sendNotification(notificationId: string) {
    this.logger.log(`Processing notification sending: ${notificationId}`);
  }
}
