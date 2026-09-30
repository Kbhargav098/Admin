import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('Observability');

  info(msg: string, meta?: any) {
    this.logger.log(`${msg} ${meta ? JSON.stringify(meta) : ''}`);
  }

  error(msg: string, trace?: string) {
    this.logger.error(msg, trace);
  }
}
