import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ResumeWorker {
  private readonly logger = new Logger(ResumeWorker.name);

  async processResume(resumeId: string) {
    this.logger.log(`Processing resume parsing for ID: ${resumeId}`);
  }
}
