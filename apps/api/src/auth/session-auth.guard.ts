import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies?.vic_session;

    if (!sessionId) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({ where: { id: Number(sessionId) } });

    if (!user || user.status === 'blocked') {
      throw new UnauthorizedException();
    }

    request.user = user;
    return true;
  }
}
