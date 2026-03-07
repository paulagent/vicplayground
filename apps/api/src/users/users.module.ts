import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, SessionAuthGuard]
})
export class UsersModule {}
