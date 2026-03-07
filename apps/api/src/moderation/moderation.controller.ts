import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsInt, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/current-user.decorator';
import { PrismaService } from '../common/prisma.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

class CreateReportDto {
  @IsIn(['post', 'comment'])
  targetType!: 'post' | 'comment';

  @IsInt()
  targetId!: number;

  @IsString()
  @MinLength(3)
  reason!: string;
}

@Controller('reports')
export class ModerationController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(SessionAuthGuard)
  createReport(@CurrentUser() user: { id: number }, @Body() dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reporterUserId: user.id,
        targetType: dto.targetType,
        targetId: dto.targetId,
        reason: dto.reason
      }
    });
  }
}
