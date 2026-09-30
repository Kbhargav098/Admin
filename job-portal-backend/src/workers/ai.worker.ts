import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiWorker {
  private readonly logger = new Logger(AiWorker.name);

  async processTask(taskId: string) {
    this.logger.log(`Processing AI task: ${taskId}`);
  }
}
