import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientTokensException extends HttpException {
  constructor(message = 'Insufficient token balance to perform this operation') {
    super(
      {
        success: false,
        error: {
          code: 'INSUFFICIENT_TOKENS',
          message,
        },
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}

export class TenantMismatchException extends HttpException {
  constructor(message = 'Access denied: Organization scope mismatch') {
    super(
      {
        success: false,
        error: {
          code: 'TENANT_MISMATCH',
          message,
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
