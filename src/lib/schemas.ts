import { z } from "zod";

// Archivist Agent Schema
export const ArchivistOutputSchema = z.object({
  themes: z.array(z.string()).min(3).max(8),
  voice_tags: z.array(z.string()).min(1),
  project_lineage: z
    .object({
      belongs_to_piece_id: z.string(),
      rationale: z.string(),
    })
    .optional(),
  status: z.enum([
    "FINISHED",
    "NEEDS_POLISH",
    "FRAGMENT",
    "SEED",
    "ARCHIVE",
  ]),
  quality_band: z.enum(["A", "B", "C"]),
  notes: z.string().max(600), // ~120 words
});

export type ArchivistOutput = z.infer<typeof ArchivistOutputSchema>;

// Placement Agent Schema
export const PlacementOutputSchema = z.object({
  primary_lane: z.enum(["SUBMISSION", "PLATFORM", "PRODUCT", "ARCHIVE"]),
  secondary_allowed_uses: z.array(z.string()).optional(),
  exclusivity_constraints: z.enum([
    "SAFE_TO_PUBLISH",
    "HOLD_FOR_SUBMISSION",
    "LIMITED_EXCERPTS_ONLY",
  ]),
  recommended_next_action: z.enum([
    "SUBMIT_NOW",
    "POLISH_1_2_HOURS",
    "CONVERT_TO_THREAD",
    "ADD_TO_EBOOK",
    "MINE_FOR_PARTS",
    "DO_NOT_TOUCH",
  ]),
  target_outlets: z.array(z.string()).max(3).optional(),
});

export type PlacementOutput = z.infer<typeof PlacementOutputSchema>;

// Compiler Agent Schema
export const CollectionSchema = z.object({
  title_working: z.string(),
  positioning: z.string().max(200), // 1 sentence
  included_piece_ids: z.array(z.string()),
  missing_connective_tissue: z.array(z.string()),
  estimated_effort_hours: z.number(),
  recommended_price_band: z.enum(["LOW", "MID", "HIGH"]),
  launch_readiness: z.enum([
    "READY",
    "NEEDS_ASSEMBLY",
    "NEEDS_NEW_WRITING",
  ]),
});

export const CompilerOutputSchema = z.object({
  collections: z.array(CollectionSchema),
});

export type CompilerOutput = z.infer<typeof CompilerOutputSchema>;
export type Collection = z.infer<typeof CollectionSchema>;

// Repurposer Agent Schema
export const RepurposeFormatSchema = z.enum([
  "THREAD",
  "NEWSLETTER",
  "PODCAST_MONOLOGUE",
  "YT_SHORT_SCRIPT",
  "LONG_VIDEO_SCRIPT",
]);

export const RepurposeOutputItemSchema = z.object({
  format: RepurposeFormatSchema,
  content: z.string(),
});

export const RepurposeOutputSchema = z.object({
  recommended_formats: z.array(RepurposeFormatSchema),
  outputs: z.array(RepurposeOutputItemSchema).max(2), // Top 1-2 only
});

export type RepurposeOutput = z.infer<typeof RepurposeOutputSchema>;

// Executive Agent Schema
export const TaskSchema = z.object({
  task_type: z.enum(["SUBMISSION", "PLATFORM", "PRODUCT"]),
  piece_ids: z.array(z.string()),
  why_now: z.string().max(200), // ~40 words
  checklist: z.array(z.string()),
  time_estimate_minutes: z.number(),
});

export const ExecutiveOutputSchema = z.object({
  weekly_queue: z.object({
    submission_tasks: z.array(TaskSchema).max(3),
    platform_tasks: z.array(TaskSchema).max(3),
    product_tasks: z.array(TaskSchema).max(1),
  }),
  do_not_touch: z.array(
    z.object({
      piece_id: z.string(),
      reason: z.string(),
    })
  ),
});

export type ExecutiveOutput = z.infer<typeof ExecutiveOutputSchema>;
export type Task = z.infer<typeof TaskSchema>;
