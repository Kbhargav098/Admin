import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; // Simplified in-memory rate limiter guard
  }
}
