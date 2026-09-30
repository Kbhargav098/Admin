import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { authConfig } from './auth.config';
import { storageConfig } from './storage.config';
import { redisConfig } from './redis.config';
import { searchConfig } from './search.config';
import { paymentConfig } from './payment.config';
import { aiConfig } from './ai.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        storageConfig,
        redisConfig,
        searchConfig,
        paymentConfig,
        aiConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
