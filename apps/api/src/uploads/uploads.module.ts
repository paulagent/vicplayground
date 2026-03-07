import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { PrismaService } from '../common/prisma.service';

@Module({ controllers: [UploadsController], providers: [SessionAuthGuard, PrismaService] })
export class UploadsModule {}
