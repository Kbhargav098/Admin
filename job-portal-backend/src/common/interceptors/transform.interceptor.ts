import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseEnvelope } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseEnvelope<T>> {
    return next.handle().pipe(
      map((result) => {
        // If result is already structured as response envelope, return it
        if (result && typeof result === 'object' && 'success' in result) {
          return result;
        }

        // If result has data and meta
        if (result && typeof result === 'object' && 'data' in result) {
          return {
            success: true,
            data: result.data,
            meta: result.meta,
          };
        }

        return {
          success: true,
          data: result ?? null,
        };
      }),
    );
  }
}
