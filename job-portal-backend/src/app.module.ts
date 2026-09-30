import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { EmailModule } from './infrastructure/email/email.module';
import { SearchModule } from './infrastructure/search/search.module';
import { WebSocketModule } from './infrastructure/websocket/websocket.module';
import { PaymentModule } from './infrastructure/payments/payment.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { ObservabilityModule } from './infrastructure/observability/observability.module';
import { SecurityModule } from './security/security.module';
import { HealthModule } from './health/health.module';
import { ApiV1Module } from './api/v1/api.module';

import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { OrganizationGuard } from './common/guards/organization.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    RedisModule,
    QueueModule,
    StorageModule,
    EmailModule,
    SearchModule,
    WebSocketModule,
    PaymentModule,
    AiModule,
    ObservabilityModule,
    SecurityModule,
    HealthModule,
    ApiV1Module,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OrganizationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
