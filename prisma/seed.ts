import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.link.create({
    data: {
      originalUrl: "https://www.bekk.no",
      slug: "bekk",
    },
  });

  await prisma.link.create({
    data: {
      originalUrl: "https://selbekk.io",
      slug: "selbekk",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
