import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  listPosts() {
    return this.postsService.list();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getById(id);
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  createPost(@CurrentUser() user: { id: number }, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard)
  updatePost(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto
  ) {
    return this.postsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard)
  deletePost(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(user.id, id);
  }
}
