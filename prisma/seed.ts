import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data (in order of dependencies)
  await prisma.weeklyReport.deleteMany();
  await prisma.postingLog.deleteMany();
  await prisma.vAAssignment.deleteMany();
  await prisma.contentCalendar.deleteMany();
  await prisma.contentSeries.deleteMany();
  await prisma.clientStrategy.deleteMany();
  await prisma.repurposeOutput.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.archivistTags.deleteMany();
  await prisma.piece.deleteMany();
  await prisma.client.deleteMany();

  // Create a sample client
  const sampleClient = await prisma.client.create({
    data: {
      name: "Sarah Mitchell",
      email: "sarah@leadershiplab.com",
      coachingNiche: "Executive Leadership",
      targetAudience: "C-suite executives at Fortune 500 companies",
      tier: "TIER_1",
      status: "ACTIVE",
    },
  });

  console.log(`Created sample client: ${sampleClient.name}`);

  // Create a sample piece
  const samplePiece = await prisma.piece.create({
    data: {
      clientId: sampleClient.id,
      title: "Why Your Best Employees Are Leaving",
      body: "Sample podcast transcript content...",
      source: "podcast",
      wordCount: 847,
    },
  });

  console.log(`Created sample piece: ${samplePiece.title}`);

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
