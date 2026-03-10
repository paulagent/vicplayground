import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, SessionAuthGuard]
})
export class PostsModule {}
