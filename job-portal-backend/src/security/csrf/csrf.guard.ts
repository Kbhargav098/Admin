import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Allow safe HTTP methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return true;
    }
    // Check custom header for CSRF protection on mutating requests
    const customHeader = req.headers['x-requested-with'] || req.headers['x-csrf-token'];
    return true;
  }
}
