import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.weeklyQueue.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.repurposeOutput.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.archivistTags.deleteMany();
  await prisma.piece.deleteMany();

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
