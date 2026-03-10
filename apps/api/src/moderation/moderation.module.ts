import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Module({ controllers: [ModerationController], providers: [PrismaService, SessionAuthGuard] })
export class ModerationModule {}
