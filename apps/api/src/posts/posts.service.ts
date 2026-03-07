import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.post.findMany({ where: { status: 'published' }, orderBy: { createdAt: 'desc' } });
  }

  getById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        title: dto.title,
        body: dto.body
      }
    });
  }

  async update(userId: number, id: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Cannot edit this post');

    return this.prisma.post.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Cannot delete this post');

    return this.prisma.post.update({ where: { id }, data: { status: 'deleted' } });
  }
}
