import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { RolesGuard } from '../common/roles.guard';

@Module({ controllers: [AdminController], providers: [PrismaService, SessionAuthGuard, RolesGuard] })
export class AdminModule {}
