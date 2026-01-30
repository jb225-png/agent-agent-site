import { z } from "zod";

// ============================================
// AGENT-AGENT: COACHES EDITION
// ============================================

// Archivist Agent Schema (mostly unchanged)
export const ArchivistOutputSchema = z.object({
  themes: z.array(z.string()).min(2).max(8),
  voice_tags: z.array(z.string()).min(1),
  content_type: z.enum([
    "PODCAST_TRANSCRIPT",
    "VIDEO_TRANSCRIPT", 
    "VOICE_MEMO",
    "WRITTEN_CONTENT",
    "WORKSHOP_RECORDING",
    "CLIENT_CALL",
    "SOCIAL_POST",
    "EMAIL",
    "OTHER"
  ]),
  status: z.enum([
    "READY",           // Can be repurposed immediately
    "NEEDS_CLEANUP",   // Has good content but needs editing
    "RAW",             // Unpolished but usable
    "ARCHIVE",         // Not worth repurposing
  ]),
  quality_band: z.enum(["A", "B", "C"]),
  key_insights: z.array(z.string()).min(1).max(10), // Extractable insights/quotes
  notes: z.string().max(600),
});

export type ArchivistOutput = z.infer<typeof ArchivistOutputSchema>;

// Placement Agent Schema (adapted for coaches)
export const PlacementOutputSchema = z.object({
  primary_platform: z.enum([
    "LINKEDIN",
    "TWITTER",
    "INSTAGRAM", 
    "EMAIL",
    "BLOG",
    "YOUTUBE",
    "ARCHIVE"
  ]),
  secondary_platforms: z.array(z.enum([
    "LINKEDIN",
    "TWITTER",
    "INSTAGRAM",
    "EMAIL", 
    "BLOG",
    "YOUTUBE"
  ])).optional(),
  content_potential: z.enum([
    "HIGH",    // Can generate 10+ pieces
    "MEDIUM",  // Can generate 5-10 pieces
    "LOW",     // Can generate 1-4 pieces
  ]),
  recommended_formats: z.array(z.string()).max(5),
  reasoning: z.string().max(200),
});

export type PlacementOutput = z.infer<typeof PlacementOutputSchema>;

// Repurposer Agent Schema (major changes for coaches)
export const LinkedInPostSchema = z.object({
  format: z.enum(["story", "listicle", "insight", "question", "hot_take", "case_study", "how_to"]),
  hook: z.string().max(200),  // First line that grabs attention
  body: z.string(),
  cta: z.string().max(100).optional(),
  hashtags: z.array(z.string()).max(5).optional(),
});

export const TwitterThreadSchema = z.object({
  tweets: z.array(z.object({
    text: z.string().max(280),
    position: z.number(),
  })).min(3).max(15),
  hook_tweet: z.string().max(280),
});

export const InstagramCaptionSchema = z.object({
  caption: z.string().max(2200),
  hook: z.string().max(125),  // Shows before "more"
  hashtags: z.array(z.string()).max(30),
  carousel_slides: z.array(z.string()).max(10).optional(),  // Text for carousel if applicable
});

export const EmailDraftSchema = z.object({
  subject_line: z.string().max(60),
  preview_text: z.string().max(100),
  body: z.string(),
  cta: z.string().max(100),
});

export const BlogOutlineSchema = z.object({
  title: z.string(),
  meta_description: z.string().max(160),
  sections: z.array(z.object({
    heading: z.string(),
    key_points: z.array(z.string()),
  })),
  estimated_word_count: z.number(),
});

export const RepurposeOutputSchema = z.object({
  source_piece_id: z.string(),
  linkedin_posts: z.array(LinkedInPostSchema).max(7),
  twitter_threads: z.array(TwitterThreadSchema).max(5),
  instagram_captions: z.array(InstagramCaptionSchema).max(5),
  email_drafts: z.array(EmailDraftSchema).max(2),
  blog_outlines: z.array(BlogOutlineSchema).max(1),
});

export type RepurposeOutput = z.infer<typeof RepurposeOutputSchema>;
export type LinkedInPost = z.infer<typeof LinkedInPostSchema>;
export type TwitterThread = z.infer<typeof TwitterThreadSchema>;
export type InstagramCaption = z.infer<typeof InstagramCaptionSchema>;
export type EmailDraft = z.infer<typeof EmailDraftSchema>;
export type BlogOutline = z.infer<typeof BlogOutlineSchema>;

// Compiler Agent Schema (adapted for coaches - content series)
export const ContentSeriesSchema = z.object({
  title: z.string(),
  description: z.string().max(300),
  theme: z.string(),
  included_piece_ids: z.array(z.string()),
  recommended_sequence: z.array(z.string()), // Ordered piece IDs
  series_type: z.enum([
    "EMAIL_SEQUENCE",
    "BLOG_SERIES", 
    "LINKEDIN_SERIES",
    "LEAD_MAGNET",
    "COURSE_MODULE"
  ]),
  estimated_pieces: z.number(),
  gaps: z.array(z.string()), // What's missing to complete the series
});

export const CompilerOutputSchema = z.object({
  content_series: z.array(ContentSeriesSchema),
  standalone_pieces: z.array(z.string()), // Piece IDs that don't fit series
});

export type CompilerOutput = z.infer<typeof CompilerOutputSchema>;
export type ContentSeries = z.infer<typeof ContentSeriesSchema>;

// Executive Agent Schema (30-day calendar)
export const CalendarEntrySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:MM
  platform: z.enum(["LINKEDIN", "TWITTER", "INSTAGRAM", "EMAIL", "BLOG"]),
  content_type: z.string(),
  piece_id: z.string().optional(), // Source piece if applicable
  repurposed_content_index: z.number().optional(), // Which repurposed piece to use
  notes: z.string().max(100).optional(),
});

export const ExecutiveOutputSchema = z.object({
  calendar: z.array(CalendarEntrySchema),
  weekly_breakdown: z.object({
    linkedin_posts: z.number(),
    twitter_posts: z.number(),
    instagram_posts: z.number(),
    emails: z.number(),
    blog_posts: z.number(),
  }),
  strategy_notes: z.string().max(500),
  content_gaps: z.array(z.string()), // What content is missing for a full calendar
});

export type ExecutiveOutput = z.infer<typeof ExecutiveOutputSchema>;
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>;

// NEW: Strategist Agent Schema
export const StrategistInputSchema = z.object({
  coaching_niche: z.string(),
  target_audience: z.string(),
  current_revenue: z.enum(["under_100k", "100k_500k", "500k_1m", "1m_5m", "over_5m"]),
  current_platforms: z.array(z.string()),
  audience_size: z.object({
    linkedin: z.number().optional(),
    twitter: z.number().optional(),
    instagram: z.number().optional(),
    email_list: z.number().optional(),
    youtube: z.number().optional(),
  }),
  content_time_weekly_hours: z.number(),
  primary_goal: z.enum([
    "grow_audience",
    "get_clients",
    "build_authority",
    "launch_product",
    "all_of_above"
  ]),
  current_content_sources: z.array(z.enum([
    "podcast",
    "youtube",
    "workshops",
    "client_calls",
    "written",
    "voice_memos",
    "none"
  ])),
});

export const StrategistOutputSchema = z.object({
  platform_priority: z.array(z.object({
    platform: z.string(),
    priority: z.number(), // 1 = highest
    reasoning: z.string().max(200),
    weekly_target: z.string(), // e.g., "3-5 posts"
  })),
  content_strategy: z.object({
    primary_content_type: z.string(),
    content_pillars: z.array(z.string()).min(3).max(5),
    posting_cadence: z.string(),
    engagement_strategy: z.string().max(300),
  }),
  quick_wins: z.array(z.object({
    action: z.string(),
    impact: z.enum(["high", "medium", "low"]),
    effort: z.enum(["high", "medium", "low"]),
    timeframe: z.string(),
  })).max(5),
  recommendations: z.array(z.string()).max(5),
});

export type StrategistInput = z.infer<typeof StrategistInputSchema>;
export type StrategistOutput = z.infer<typeof StrategistOutputSchema>;
