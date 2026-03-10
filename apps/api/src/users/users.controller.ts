import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Controller()
export class UsersController {
  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@CurrentUser() user: unknown) {
    return user;
  }
}
