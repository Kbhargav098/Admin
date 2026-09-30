import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(filename: string, content: Buffer | string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, content);
    this.logger.log(`File saved locally at: ${filePath}`);
    return `/uploads/${filename}`;
  }
}
