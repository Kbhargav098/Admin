import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TokenWorker {
  private readonly logger = new Logger(TokenWorker.name);

  async processTokenRollover() {
    this.logger.log('Processing monthly token rollover/expiration');
  }
}
