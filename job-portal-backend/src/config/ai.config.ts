import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  enabled: false,
}));
