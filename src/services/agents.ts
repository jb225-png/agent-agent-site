import { runAgent } from "@/lib/llm";
import { startOfWeek } from "date-fns";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

/**
 * Run The Archivist on a single piece
 */
export async function runArchivistOnPiece(pieceId: string) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const output = await runAgent("archivist", { piece });

  // Save to database
  await prisma.archivistTags.upsert({
    where: { pieceId },
    create: {
      pieceId,
      themesJson: JSON.stringify(output.themes),
      voiceTagsJson: JSON.stringify(output.voice_tags),
      status: output.status,
      qualityBand: output.quality_band,
      notes: output.notes,
      lineageJson: JSON.stringify(output.project_lineage || {}),
    },
    update: {
      themesJson: JSON.stringify(output.themes),
      voiceTagsJson: JSON.stringify(output.voice_tags),
      status: output.status,
      qualityBand: output.quality_band,
      notes: output.notes,
      lineageJson: JSON.stringify(output.project_lineage || {}),
    },
  });

  return output;
}

/**
 * Run The Placement Agent on a single piece
 */
export async function runPlacementOnPiece(pieceId: string) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const output = await runAgent("placement", { piece });

  // Save to database
  await prisma.placement.upsert({
    where: { pieceId },
    create: {
      pieceId,
      primaryLane: output.primary_lane,
      secondaryJson: JSON.stringify(output.secondary_allowed_uses || []),
      exclusivity: output.exclusivity_constraints,
      recommendedNextAction: output.recommended_next_action,
      outletsJson: JSON.stringify(output.target_outlets || []),
    },
    update: {
      primaryLane: output.primary_lane,
      secondaryJson: JSON.stringify(output.secondary_allowed_uses || []),
      exclusivity: output.exclusivity_constraints,
      recommendedNextAction: output.recommended_next_action,
      outletsJson: JSON.stringify(output.target_outlets || []),
    },
  });

  return output;
}

/**
 * Run The Repurposer on a single piece
 */
export async function runRepurposerOnPiece(pieceId: string) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
    include: { placement: true },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const exclusivity = piece.placement?.exclusivity || "SAFE_TO_PUBLISH";

  // Don't repurpose if held for submission
  if (exclusivity === "HOLD_FOR_SUBMISSION") {
    return { recommended_formats: [], outputs: [] };
  }

  const output = await runAgent("repurposer", { piece, exclusivity });

  // Delete old outputs for this piece
  await prisma.repurposeOutput.deleteMany({
    where: { pieceId },
  });

  // Save new outputs
  for (const item of output.outputs) {
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        format: item.format,
        content: item.content,
      },
    });
  }

  return output;
}

/**
 * Run The Compiler on all pieces
 */
export async function runCompiler() {
  const prisma = await getPrisma();
  const pieces = await prisma.piece.findMany({
    include: {
      archivistTags: true,
      placement: true,
    },
  });

  const output = await runAgent("compiler", { pieces });

  // Delete old collections
  await prisma.collection.deleteMany();

  // Save new collections
  for (const collection of output.collections) {
    await prisma.collection.create({
      data: {
        titleWorking: collection.title_working,
        positioning: collection.positioning,
        includedPieceIdsJson: JSON.stringify(collection.included_piece_ids),
        missingJson: JSON.stringify(collection.missing_connective_tissue),
        estimatedEffortHours: collection.estimated_effort_hours,
        recommendedPriceBand: collection.recommended_price_band,
        launchReadiness: collection.launch_readiness,
      },
    });
  }

  return output;
}

/**
 * Run The Executive to create weekly queue
 */
export async function runExecutive() {
  const prisma = await getPrisma();
  const pieces = await prisma.piece.findMany({
    include: {
      archivistTags: true,
      placement: true,
    },
  });

  const output = await runAgent("executive", { pieces });

  // Get current week start
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

  // Delete old queue for this week
  await prisma.weeklyQueue.deleteMany({
    where: { weekStartDate: weekStart },
  });

  // Combine all tasks
  const allTasks = [
    ...output.weekly_queue.submission_tasks,
    ...output.weekly_queue.platform_tasks,
    ...output.weekly_queue.product_tasks,
  ];

  // Save new queue
  await prisma.weeklyQueue.create({
    data: {
      weekStartDate: weekStart,
      tasksJson: JSON.stringify(allTasks),
      doNotTouchJson: JSON.stringify(output.do_not_touch),
    },
  });

  return output;
}

/**
 * Run entire pipeline on a single piece
 */
export async function runPipelineOnPiece(pieceId: string) {
  console.log(`Running pipeline on piece ${pieceId}...`);

  const archivist = await runArchivistOnPiece(pieceId);
  console.log(`✓ Archivist complete`);

  const placement = await runPlacementOnPiece(pieceId);
  console.log(`✓ Placement complete`);

  const repurposer = await runRepurposerOnPiece(pieceId);
  console.log(`✓ Repurposer complete`);

  return { archivist, placement, repurposer };
}

/**
 * Run entire pipeline on all pieces
 */
export async function runPipelineOnAll() {
  const prisma = await getPrisma();
  console.log("Running pipeline on all pieces...");

  const pieces = await prisma.piece.findMany();

  // Run individual piece agents
  for (const piece of pieces) {
    await runPipelineOnPiece(piece.id);
  }

  // Run collection-level agents
  console.log("Running Compiler...");
  await runCompiler();

  console.log("Running Executive...");
  await runExecutive();

  console.log("✓ Pipeline complete");
}
