import { runAgent } from "@/lib/llm";
import { StrategistInput } from "@/lib/schemas";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

/**
 * Run The Archivist on a single piece
 */
export async function runArchivistOnPiece(pieceId: string, clientContext?: any) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const output = await runAgent("archivist", { piece, clientContext });

  // Save to database
  await prisma.archivistTags.upsert({
    where: { pieceId },
    create: {
      pieceId,
      themesJson: JSON.stringify(output.themes),
      voiceTagsJson: JSON.stringify(output.voice_tags),
      contentType: output.content_type,
      status: output.status,
      qualityBand: output.quality_band,
      keyInsightsJson: JSON.stringify(output.key_insights),
      notes: output.notes,
    },
    update: {
      themesJson: JSON.stringify(output.themes),
      voiceTagsJson: JSON.stringify(output.voice_tags),
      contentType: output.content_type,
      status: output.status,
      qualityBand: output.quality_band,
      keyInsightsJson: JSON.stringify(output.key_insights),
      notes: output.notes,
    },
  });

  return output;
}

/**
 * Run The Placement Agent on a single piece
 */
export async function runPlacementOnPiece(pieceId: string, clientContext?: any) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const output = await runAgent("placement", { piece, clientContext });

  // Save to database
  await prisma.placement.upsert({
    where: { pieceId },
    create: {
      pieceId,
      primaryPlatform: output.primary_platform,
      secondaryPlatformsJson: JSON.stringify(output.secondary_platforms || []),
      contentPotential: output.content_potential,
      recommendedFormatsJson: JSON.stringify(output.recommended_formats),
      reasoning: output.reasoning,
    },
    update: {
      primaryPlatform: output.primary_platform,
      secondaryPlatformsJson: JSON.stringify(output.secondary_platforms || []),
      contentPotential: output.content_potential,
      recommendedFormatsJson: JSON.stringify(output.recommended_formats),
      reasoning: output.reasoning,
    },
  });

  return output;
}

/**
 * Run The Repurposer on a single piece
 */
export async function runRepurposerOnPiece(pieceId: string, clientContext?: any) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: pieceId },
    include: { placement: true },
  });

  if (!piece) {
    throw new Error(`Piece ${pieceId} not found`);
  }

  const output = await runAgent("repurposer", { piece, clientContext });

  // Delete old outputs for this piece
  await prisma.repurposeOutput.deleteMany({
    where: { pieceId },
  });

  // Save LinkedIn posts
  for (let i = 0; i < output.linkedin_posts.length; i++) {
    const post = output.linkedin_posts[i];
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        platform: "LINKEDIN",
        format: post.format,
        contentJson: JSON.stringify(post),
        position: i,
      },
    });
  }

  // Save Twitter threads
  for (let i = 0; i < output.twitter_threads.length; i++) {
    const thread = output.twitter_threads[i];
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        platform: "TWITTER",
        format: "thread",
        contentJson: JSON.stringify(thread),
        position: i,
      },
    });
  }

  // Save Instagram captions
  for (let i = 0; i < output.instagram_captions.length; i++) {
    const caption = output.instagram_captions[i];
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        platform: "INSTAGRAM",
        format: "caption",
        contentJson: JSON.stringify(caption),
        position: i,
      },
    });
  }

  // Save email drafts
  for (let i = 0; i < output.email_drafts.length; i++) {
    const email = output.email_drafts[i];
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        platform: "EMAIL",
        format: "newsletter",
        contentJson: JSON.stringify(email),
        position: i,
      },
    });
  }

  // Save blog outlines
  for (let i = 0; i < output.blog_outlines.length; i++) {
    const outline = output.blog_outlines[i];
    await prisma.repurposeOutput.create({
      data: {
        pieceId,
        platform: "BLOG",
        format: "outline",
        contentJson: JSON.stringify(outline),
        position: i,
      },
    });
  }

  return output;
}

/**
 * Run The Compiler on all pieces for a client
 */
export async function runCompiler(clientId?: string) {
  const prisma = await getPrisma();
  
  const whereClause = clientId ? { clientId } : {};
  
  const pieces = await prisma.piece.findMany({
    where: whereClause,
    include: {
      archivistTags: true,
      placement: true,
    },
  });

  const output = await runAgent("compiler", { pieces });

  // Delete old content series
  await prisma.contentSeries.deleteMany({
    where: clientId ? { clientId } : {},
  });

  // Save new content series
  for (const series of output.content_series) {
    await prisma.contentSeries.create({
      data: {
        clientId: clientId || "default",
        title: series.title,
        description: series.description,
        theme: series.theme,
        includedPieceIdsJson: JSON.stringify(series.included_piece_ids),
        recommendedSequenceJson: JSON.stringify(series.recommended_sequence),
        seriesType: series.series_type,
        estimatedPieces: series.estimated_pieces,
        gapsJson: JSON.stringify(series.gaps),
      },
    });
  }

  return output;
}

/**
 * Run The Executive to create 30-day calendar
 */
export async function runExecutive(clientId?: string) {
  const prisma = await getPrisma();
  
  const whereClause = clientId ? { clientId } : {};
  
  const pieces = await prisma.piece.findMany({
    where: whereClause,
    include: {
      archivistTags: true,
      placement: true,
    },
  });

  const output = await runAgent("executive", { pieces });

  // Delete old calendar for this client
  await prisma.contentCalendar.deleteMany({
    where: clientId ? { clientId } : {},
  });

  // Save new calendar
  await prisma.contentCalendar.create({
    data: {
      clientId: clientId || "default",
      calendarJson: JSON.stringify(output.calendar),
      weeklyBreakdownJson: JSON.stringify(output.weekly_breakdown),
      strategyNotes: output.strategy_notes,
      contentGapsJson: JSON.stringify(output.content_gaps),
    },
  });

  return output;
}

/**
 * Run The Strategist for client intake
 */
export async function runStrategist(input: StrategistInput, clientId?: string) {
  const prisma = await getPrisma();
  
  const output = await runAgent("strategist", { strategistInput: input });

  // Save strategy to database
  if (clientId) {
    await prisma.clientStrategy.upsert({
      where: { clientId },
      create: {
        clientId,
        inputJson: JSON.stringify(input),
        platformPriorityJson: JSON.stringify(output.platform_priority),
        contentStrategyJson: JSON.stringify(output.content_strategy),
        quickWinsJson: JSON.stringify(output.quick_wins),
        recommendationsJson: JSON.stringify(output.recommendations),
      },
      update: {
        inputJson: JSON.stringify(input),
        platformPriorityJson: JSON.stringify(output.platform_priority),
        contentStrategyJson: JSON.stringify(output.content_strategy),
        quickWinsJson: JSON.stringify(output.quick_wins),
        recommendationsJson: JSON.stringify(output.recommendations),
      },
    });
  }

  return output;
}

/**
 * Run entire pipeline on a single piece
 */
export async function runPipelineOnPiece(pieceId: string, clientContext?: any) {
  console.log(`Running pipeline on piece ${pieceId}...`);

  const archivist = await runArchivistOnPiece(pieceId, clientContext);
  console.log(`✓ Archivist complete`);

  const placement = await runPlacementOnPiece(pieceId, clientContext);
  console.log(`✓ Placement complete`);

  const repurposer = await runRepurposerOnPiece(pieceId, clientContext);
  console.log(`✓ Repurposer complete`);

  return { archivist, placement, repurposer };
}

/**
 * Run entire pipeline on all pieces
 */
export async function runPipelineOnAll(clientId?: string, clientContext?: any) {
  const prisma = await getPrisma();
  console.log("Running pipeline on all pieces...");

  const whereClause = clientId ? { clientId } : {};
  const pieces = await prisma.piece.findMany({ where: whereClause });

  // Run individual piece agents
  for (const piece of pieces) {
    await runPipelineOnPiece(piece.id, clientContext);
  }

  // Run collection-level agents
  console.log("Running Compiler...");
  await runCompiler(clientId);

  console.log("Running Executive...");
  await runExecutive(clientId);

  console.log("✓ Pipeline complete");
}

/**
 * Full client onboarding: Strategist + Pipeline
 */
export async function runClientOnboarding(
  clientId: string,
  strategistInput: StrategistInput
) {
  console.log(`Starting onboarding for client ${clientId}...`);

  // First run strategist
  console.log("Running Strategist...");
  const strategy = await runStrategist(strategistInput, clientId);
  console.log(`✓ Strategy complete`);

  // Build client context from strategy
  const clientContext = {
    niche: strategistInput.coaching_niche,
    audience: strategistInput.target_audience,
    platforms: strategy.platform_priority.map((p: any) => p.platform),
  };

  // Run full pipeline with client context
  await runPipelineOnAll(clientId, clientContext);

  return strategy;
}
