import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Module({ controllers: [CommentsController], providers: [PrismaService, SessionAuthGuard] })
export class CommentsModule {}
