import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'super-secret-jwt-access-key-for-job-portal',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-for-job-portal',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
}));
