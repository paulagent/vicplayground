import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'anonymous@vicplayground.local' },
    update: { displayName: 'Vic Guest' },
    create: {
      email: 'anonymous@vicplayground.local',
      displayName: 'Vic Guest'
    }
  });

  const categories = [
    { slug: 'outdoor', nameZh: '户外活动', nameEn: 'Outdoor Activities', sortOrder: 1 },
    { slug: 'crafts', nameZh: '手作工艺', nameEn: 'Crafts', sortOrder: 2 },
    { slug: 'pets', nameZh: '宠物生活', nameEn: 'Pets', sortOrder: 3 },
    { slug: 'events', nameZh: '本地活动', nameEn: 'Local Events', sortOrder: 4 },
    { slug: 'tips', nameZh: '本地推荐', nameEn: 'Recommendations', sortOrder: 5 }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
