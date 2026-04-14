import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { PrismaService } from '../common/prisma.service';
import { ANONYMOUS_USER_DISPLAY_NAME, ANONYMOUS_USER_EMAIL } from '../common/anonymous-user';

class CommentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  authorName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1200)
  body!: string;
}

@Controller()
export class CommentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('posts/:id/comments')
  async createComment(
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CommentDto
  ) {
    const anonymousUser = await this.prisma.user.upsert({
      where: { email: ANONYMOUS_USER_EMAIL },
      update: { displayName: ANONYMOUS_USER_DISPLAY_NAME },
      create: {
        email: ANONYMOUS_USER_EMAIL,
        displayName: ANONYMOUS_USER_DISPLAY_NAME
      }
    });

    return this.prisma.comment.create({
      data: {
        postId,
        userId: anonymousUser.id,
        authorName: dto.authorName?.trim() || ANONYMOUS_USER_DISPLAY_NAME,
        body: dto.body
      },
      include: {
        user: {
          select: {
            displayName: true
          }
        }
      }
    });
  }

  @Patch('comments/:id')
  @UseGuards(SessionAuthGuard)
  updateComment(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number, @Body() dto: CommentDto) {
    return this.prisma.comment.updateMany({
      where: { id, userId: user.id },
      data: { body: dto.body }
    });
  }

  @Delete('comments/:id')
  @UseGuards(SessionAuthGuard)
  deleteComment(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return this.prisma.comment.updateMany({
      where: { id, userId: user.id },
      data: { status: 'deleted' }
    });
  }
}
