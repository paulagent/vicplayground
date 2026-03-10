import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getCategories() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}
