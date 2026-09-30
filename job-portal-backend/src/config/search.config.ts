import { registerAs } from '@nestjs/config';

export const searchConfig = registerAs('search', () => ({
  enabled: process.env.SEARCH_ENABLED === 'true',
}));
