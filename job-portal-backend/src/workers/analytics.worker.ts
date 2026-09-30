import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnalyticsWorker {
  private readonly logger = new Logger(AnalyticsWorker.name);

  async processMetrics() {
    this.logger.log('Aggregating daily organization metrics');
  }
}
