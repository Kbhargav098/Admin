import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './password/password.service';
import { TokenService } from './tokens/token.service';
import { CsrfGuard } from './csrf/csrf.guard';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { AuditService } from './audit/audit.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    PasswordService,
    TokenService,
    CsrfGuard,
    RateLimitGuard,
    AuditService,
  ],
  exports: [
    PasswordService,
    TokenService,
    CsrfGuard,
    RateLimitGuard,
    AuditService,
    JwtModule,
  ],
})
export class SecurityModule {}
