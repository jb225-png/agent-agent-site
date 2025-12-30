import { z } from "zod";
import {
  ArchivistOutputSchema,
  PlacementOutputSchema,
  RepurposeOutputSchema,
  CompilerOutputSchema,
  ExecutiveOutputSchema,
} from "./schemas";

type AgentName =
  | "archivist"
  | "placement"
  | "compiler"
  | "repurposer"
  | "executive";

interface AgentInput {
  piece?: {
    id: string;
    title: string;
    body: string;
    wordCount: number;
  };
  pieces?: Array<{
    id: string;
    title: string;
    body: string;
    wordCount: number;
    archivistTags?: any;
    placement?: any;
  }>;
  exclusivity?: string;
}

const LLM_MODE = process.env.LLM_MODE || "mock";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Main LLM abstraction layer
 * Supports mock mode (for demo) and real mode (OpenAI API)
 */
export async function runAgent(
  agentName: AgentName,
  input: AgentInput
): Promise<any> {
  if (LLM_MODE === "mock") {
    return runMockAgent(agentName, input);
  } else if (LLM_MODE === "openai") {
    return runOpenAIAgent(agentName, input);
  } else {
    throw new Error(`Unknown LLM_MODE: ${LLM_MODE}`);
  }
}

/**
 * Mock agent implementation for demo/testing
 */
function runMockAgent(agentName: AgentName, input: AgentInput): any {
  switch (agentName) {
    case "archivist":
      return mockArchivist(input.piece!);
    case "placement":
      return mockPlacement(input.piece!);
    case "compiler":
      return mockCompiler(input.pieces!);
    case "repurposer":
      return mockRepurposer(input.piece!, input.exclusivity!);
    case "executive":
      return mockExecutive(input.pieces!);
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
}

function mockArchivist(piece: any) {
  const wordCount = piece.wordCount;
  const isShort = wordCount < 500;

  return {
    themes: isShort
      ? ["brevity", "reflection", "personal"]
      : ["narrative", "cultural commentary", "craft"],
    voice_tags: ["contemplative", "precise"],
    status: wordCount > 1000 ? "FINISHED" : "NEEDS_POLISH",
    quality_band: wordCount > 2000 ? "A" : wordCount > 800 ? "B" : "C",
    notes: `${wordCount}-word piece. ${isShort ? "Brief but focused." : "Well-developed argument."} ${wordCount > 2000 ? "Publication-ready." : "Could use expansion."}`,
  };
}

function mockPlacement(piece: any) {
  const wordCount = piece.wordCount;

  if (wordCount < 400) {
    return {
      primary_lane: "PLATFORM",
      exclusivity_constraints: "SAFE_TO_PUBLISH",
      recommended_next_action: "CONVERT_TO_THREAD",
      target_outlets: [],
    };
  } else if (wordCount > 2000) {
    return {
      primary_lane: "SUBMISSION",
      secondary_allowed_uses: ["excerpts for newsletter"],
      exclusivity_constraints: "HOLD_FOR_SUBMISSION",
      recommended_next_action: "SUBMIT_NOW",
      target_outlets: [
        "Literary Magazine A",
        "Essay Quarterly B",
        "Online Journal C",
      ],
    };
  } else {
    return {
      primary_lane: "PRODUCT",
      exclusivity_constraints: "SAFE_TO_PUBLISH",
      recommended_next_action: "ADD_TO_EBOOK",
      target_outlets: [],
    };
  }
}

function mockCompiler(pieces: any[]) {
  const finishedPieces = pieces.filter(
    (p) => p.archivistTags?.status === "FINISHED"
  );

  if (finishedPieces.length < 3) {
    return { collections: [] };
  }

  return {
    collections: [
      {
        title_working: "Selected Essays",
        positioning: "A curated collection of essays on craft and culture.",
        included_piece_ids: finishedPieces.slice(0, 5).map((p) => p.id),
        missing_connective_tissue: [
          "Introduction (500 words)",
          "Transitions between sections",
        ],
        estimated_effort_hours: 8,
        recommended_price_band: "MID",
        launch_readiness: "NEEDS_ASSEMBLY",
      },
    ],
  };
}

function mockRepurposer(piece: any, exclusivity: string) {
  if (exclusivity === "HOLD_FOR_SUBMISSION") {
    return {
      recommended_formats: [],
      outputs: [],
    };
  }

  const wordCount = piece.wordCount;

  if (wordCount < 400) {
    return {
      recommended_formats: ["THREAD", "NEWSLETTER"],
      outputs: [
        {
          format: "THREAD",
          content: `1/ ${piece.title}\n\n${piece.body.substring(0, 200)}...\n\n[Thread continues]`,
        },
      ],
    };
  } else {
    return {
      recommended_formats: ["NEWSLETTER", "PODCAST_MONOLOGUE"],
      outputs: [
        {
          format: "NEWSLETTER",
          content: `Subject: ${piece.title}\n\n${piece.body.substring(0, 500)}...\n\n[Continue reading]`,
        },
      ],
    };
  }
}

function mockExecutive(pieces: any[]) {
  const submissionPieces = pieces.filter(
    (p) => p.placement?.primaryLane === "SUBMISSION"
  );
  const platformPieces = pieces.filter(
    (p) => p.placement?.primaryLane === "PLATFORM"
  );

  return {
    weekly_queue: {
      submission_tasks: submissionPieces.slice(0, 3).map((p) => ({
        task_type: "SUBMISSION" as const,
        piece_ids: [p.id],
        why_now: "High-quality piece ready for submission.",
        checklist: [
          "Review outlet guidelines",
          "Prepare cover letter",
          "Submit via submission manager",
        ],
        time_estimate_minutes: 45,
      })),
      platform_tasks: platformPieces.slice(0, 3).map((p) => ({
        task_type: "PLATFORM" as const,
        piece_ids: [p.id],
        why_now: "Convert to thread format for immediate audience engagement.",
        checklist: ["Convert to thread", "Schedule posts", "Monitor engagement"],
        time_estimate_minutes: 30,
      })),
      product_tasks: [],
    },
    do_not_touch: pieces
      .filter((p) => p.placement?.exclusivity === "HOLD_FOR_SUBMISSION")
      .map((p) => ({
        piece_id: p.id,
        reason: "Under consideration for submission.",
      })),
  };
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * OpenAI agent implementation with retry logic
 */
async function runOpenAIAgent(
  agentName: AgentName,
  input: AgentInput
): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set");
  }

  const systemPrompt = getSystemPrompt(agentName);
  const userPrompt = getUserPrompt(agentName, input);
  const schema = getSchema(agentName);

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add delay between retries (exponential backoff)
      if (attempt > 0) {
        const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retry attempt ${attempt} for ${agentName} after ${delayMs}ms delay`);
        await sleep(delayMs);
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // If rate limited (429), retry
        if (response.status === 429 && attempt < maxRetries) {
          console.warn(`Rate limited on ${agentName}, will retry...`);
          lastError = new Error(`OpenAI API error: Too Many Requests`);
          continue;
        }

        throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);

      // Validate with Zod
      const validated = schema.parse(parsed);
      return validated;
    } catch (error: any) {
      lastError = error;

      // If ZodError, fall back to mock
      if (error.name === "ZodError") {
        console.warn("Invalid JSON from LLM, falling back to mock...");
        return runMockAgent(agentName, input);
      }

      // If not the last attempt and it's a network/rate limit error, continue
      if (attempt < maxRetries && (error.message.includes("Too Many Requests") || error.message.includes("fetch"))) {
        continue;
      }

      // Otherwise, throw
      throw error;
    }
  }

  console.error(`Agent ${agentName} failed after ${maxRetries} retries:`, lastError);
  throw new Error(`Agent ${agentName} failed: ${lastError?.message}`);
}

function getSystemPrompt(agentName: AgentName): string {
  const baseRules = `You are a decisive agent. No pep talk. No generic advice. Short, useful outputs only. If uncertain, choose the safest path.`;

  switch (agentName) {
    case "archivist":
      return `${baseRules}\n\nYou are The Archivist. Categorize writing pieces with precision. Answer "What do I actually have?" Output themes (3-8), voice tags, status, quality band (A/B/C), and brief notes (<120 words). Return valid JSON only.`;
    case "placement":
      return `${baseRules}\n\nYou are The Placement Agent. Decide where each piece goes: SUBMISSION, PLATFORM, PRODUCT, or ARCHIVE. Choose exactly one primary lane. Set exclusivity constraints and recommend next action. Return valid JSON only.`;
    case "compiler":
      return `${baseRules}\n\nYou are The Compiler. Build sellable collections from related pieces. Create ebook candidates with positioning, included pieces, missing connective tissue, effort estimate, and price band. Return valid JSON only.`;
    case "repurposer":
      return `${baseRules}\n\nYou are The Repurposer. Convert pieces to platform formats ONLY if not held for submission. Recommend formats in priority order. Generate top 1-2 native-feeling outputs (threads read like threads, scripts sound spoken). Return valid JSON only.`;
    case "executive":
      return `${baseRules}\n\nYou are The Executive. Create a weekly action queue with strict limits: max 3 submission tasks, max 3 platform tasks, max 1 product task. Each task has type, piece IDs, why_now (<40 words), checklist, and time estimate. Protect pieces held for submission. Return valid JSON only.`;
    default:
      return baseRules;
  }
}

function getUserPrompt(agentName: AgentName, input: AgentInput): string {
  switch (agentName) {
    case "archivist":
      return `Analyze this piece:\n\nTitle: ${input.piece!.title}\nWord Count: ${input.piece!.wordCount}\nBody:\n${input.piece!.body.substring(0, 2000)}...\n\nReturn JSON with: themes, voice_tags, status, quality_band, notes.`;
    case "placement":
      return `Decide placement for this piece:\n\nTitle: ${input.piece!.title}\nWord Count: ${input.piece!.wordCount}\nBody:\n${input.piece!.body.substring(0, 1000)}...\n\nReturn JSON with: primary_lane, exclusivity_constraints, recommended_next_action, target_outlets.`;
    case "compiler":
      return `Build collections from these pieces:\n\n${input.pieces!.map((p) => `- ${p.title} (${p.wordCount} words)`).join("\n")}\n\nReturn JSON with: collections array.`;
    case "repurposer":
      return `Repurpose this piece (exclusivity: ${input.exclusivity}):\n\nTitle: ${input.piece!.title}\nBody:\n${input.piece!.body.substring(0, 1500)}...\n\nReturn JSON with: recommended_formats, outputs (max 2).`;
    case "executive":
      return `Create weekly queue from these pieces:\n\n${input.pieces!.map((p) => `- ${p.title}: ${p.placement?.primaryLane || "unprocessed"}`).join("\n")}\n\nReturn JSON with: weekly_queue {submission_tasks, platform_tasks, product_tasks}, do_not_touch.`;
    default:
      return "";
  }
}

function getSchema(agentName: AgentName): z.ZodSchema {
  switch (agentName) {
    case "archivist":
      return ArchivistOutputSchema;
    case "placement":
      return PlacementOutputSchema;
    case "compiler":
      return CompilerOutputSchema;
    case "repurposer":
      return RepurposeOutputSchema;
    case "executive":
      return ExecutiveOutputSchema;
    default:
      throw new Error(`No schema for agent: ${agentName}`);
  }
}
