import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ANONYMOUS_USER_DISPLAY_NAME, ANONYMOUS_USER_EMAIL } from '../common/anonymous-user';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        _count: {
          select: {
            comments: true
          }
        },
        user: {
          select: {
            displayName: true
          }
        }
      }
    });
  }

  getById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        comments: {
          where: { status: 'published' },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                displayName: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        },
        user: {
          select: {
            displayName: true
          }
        }
      }
    });
  }

  async create(dto: CreatePostDto) {
    const anonymousUser = await this.prisma.user.upsert({
      where: { email: ANONYMOUS_USER_EMAIL },
      update: { displayName: ANONYMOUS_USER_DISPLAY_NAME },
      create: {
        email: ANONYMOUS_USER_EMAIL,
        displayName: ANONYMOUS_USER_DISPLAY_NAME
      }
    });

    return this.prisma.post.create({
      data: {
        userId: anonymousUser.id,
        categoryId: dto.categoryId,
        authorName: dto.authorName?.trim() || ANONYMOUS_USER_DISPLAY_NAME,
        title: dto.title,
        body: dto.body
      },
      include: {
        category: true,
        _count: {
          select: {
            comments: true
          }
        },
        user: {
          select: {
            displayName: true
          }
        }
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
