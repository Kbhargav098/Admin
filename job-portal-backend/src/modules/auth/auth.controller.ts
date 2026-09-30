import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(body);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Public()
  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.email, body.password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() body: any) {
    const refreshToken = req.cookies?.refreshToken || body?.refreshToken;
    const result = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }
}
