import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { PrismaService } from '../common/prisma.service';

class CommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1200)
  body!: string;
}

@Controller()
export class CommentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('posts/:id/comments')
  @UseGuards(SessionAuthGuard)
  createComment(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CommentDto
  ) {
    return this.prisma.comment.create({
      data: { postId, userId: user.id, body: dto.body }
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
