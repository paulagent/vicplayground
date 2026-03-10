import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('admin')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles('moderator', 'admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('reports')
  listReports() {
    return this.prisma.report.findMany({ where: { status: 'open' }, orderBy: { createdAt: 'desc' } });
  }

  @Post('reports/:id/resolve')
  async resolveReport(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    await this.prisma.auditLog.create({
      data: { actorUserId: user.id, action: 'resolve_report', entityType: 'report', entityId: id }
    });

    return this.prisma.report.update({ where: { id }, data: { status: 'resolved' } });
  }

  @Post('users/:id/block')
  @Roles('admin')
  async blockUser(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) targetUserId: number) {
    await this.prisma.auditLog.create({
      data: { actorUserId: user.id, action: 'block_user', entityType: 'user', entityId: targetUserId }
    });

    return this.prisma.user.update({ where: { id: targetUserId }, data: { status: 'blocked' } });
  }
}
