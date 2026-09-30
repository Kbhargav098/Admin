import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        message = res.message || exception.message;
        code = res.error?.code || res.error || 'HTTP_ERROR';
        details = res.message && Array.isArray(res.message) ? res.message : undefined;
      } else if (typeof res === 'string') {
        message = res;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.stack}`);
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
    });
  }
}
