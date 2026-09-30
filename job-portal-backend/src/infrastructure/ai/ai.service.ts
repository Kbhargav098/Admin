import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateSummary(prompt: string): Promise<string> {
    return `[AI Stub Summary for: ${prompt.substring(0, 30)}...]`;
  }
}
