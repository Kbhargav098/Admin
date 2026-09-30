import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl;
    const requestId = req.headers['x-request-id'] || 'N/A';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`[ReqId: ${requestId}] ${method} ${url} ${delay}ms`);
      }),
    );
  }
}
