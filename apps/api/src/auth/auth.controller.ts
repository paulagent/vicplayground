import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: { user: any }, @Res() res: Response) {
    const user = await this.authService.upsertGoogleUser(req.user);

    res.cookie('vic_session', String(user.id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.redirect(process.env.WEB_ORIGIN ?? 'http://localhost:3000');
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('vic_session');
    return res.status(204).send();
  }
}
