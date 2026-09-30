import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailWorker {
  private readonly logger = new Logger(EmailWorker.name);

  async processEmailJob(jobData: any) {
    this.logger.log(`Processing email job for recipient: ${jobData?.to}`);
  }
}
