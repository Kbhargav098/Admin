import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log(`[EMAIL DRIVER: CONSOLE] To: ${to} | Subject: ${subject}\nContent:\n${body}`);
  }
}
