import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchIndexWorker {
  private readonly logger = new Logger(SearchIndexWorker.name);

  async indexEntity(entityType: string, entityId: string) {
    this.logger.log(`Indexing entity: ${entityType} ID: ${entityId}`);
  }
}
