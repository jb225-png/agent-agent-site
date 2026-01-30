# Agent-Agent: Coaches Edition

A cognitive agent system that transforms coaches' raw content (podcasts, workshops, voice memos, videos) into a complete content operation — organized, repurposed for every platform, and scheduled in a 30-day calendar.

## Business Context

**Target Market:** Executive coaches making $500k-5M/year who:
- Spend 10-15 hours/week on content and hate it
- Have scattered content (podcasts, workshops, client calls) with no system
- Currently pay $6,000-10,000/month for marketing managers

**The Offer:**
- **Tier 1 ($2,500/month):** Strategy + 20-30 repurposed pieces monthly + 30-day calendar
- **Tier 2 ($4,500/month):** Everything in Tier 1 + dedicated VA for hands-off posting

## The 6 Agents

### 1. The Archivist
**Goal:** Analyze and categorize content pieces

For each piece, outputs:
- Themes (2-8)
- Voice tags
- Content type (PODCAST_TRANSCRIPT, VIDEO_TRANSCRIPT, VOICE_MEMO, etc.)
- Status (READY, NEEDS_CLEANUP, RAW, ARCHIVE)
- Quality band (A/B/C)
- **Key insights** (extractable quotes and ideas)
- Notes

### 2. The Placement Agent
**Goal:** Decide platform destinations

Assigns:
- Primary platform (LinkedIn, Twitter, Instagram, Email, Blog, YouTube, Archive)
- Secondary platforms
- Content potential (HIGH/MEDIUM/LOW — how many pieces can be generated)
- Recommended formats
- Reasoning

### 3. The Repurposer
**Goal:** Transform content into platform-native pieces

Generates:
- **5-7 LinkedIn posts** (story, listicle, insight, question, hot_take, case_study, how_to)
- **3-5 Twitter threads** (3-15 tweets each)
- **3-5 Instagram captions** (with carousel slide ideas)
- **1-2 Email newsletter drafts**
- **1 Blog post outline** (with SEO meta description)

Each piece feels native to its platform with scroll-stopping hooks.

### 4. The Compiler
**Goal:** Identify content series opportunities

Creates:
- Email sequences
- Blog series
- LinkedIn series
- Lead magnets
- Course modules

Identifies what's missing to complete each series.

### 5. The Executive
**Goal:** Create a 30-day content calendar

Outputs:
- Full calendar with dates, times, platforms, content types
- Weekly breakdown (posts per platform)
- Strategy notes
- Content gaps to fill

Considers optimal posting times for each platform.

### 6. The Strategist (NEW)
**Goal:** Personalized content strategy from intake

Takes intake form data:
- Coaching niche
- Target audience
- Current revenue
- Current platforms
- Audience sizes
- Weekly hours available
- Primary goal
- Existing content sources

Outputs:
- Platform priority ranking with reasoning
- Content strategy (pillars, cadence, engagement)
- Quick wins (high impact, low effort actions)
- Actionable recommendations

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma
- **UI:** Tailwind CSS
- **LLM:** OpenAI API (gpt-4o-mini) with mock mode
- **Validation:** Zod schemas

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# For demo/testing (no API calls)
LLM_MODE=mock

# For production
LLM_MODE=openai
OPENAI_API_KEY=your-api-key-here

# Database
POSTGRES_URL="your-postgres-connection-string"
POSTGRES_URL_NON_POOLING="your-direct-connection-string"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

## API Endpoints

### Run Strategist (Client Intake)
```bash
POST /api/strategist
Content-Type: application/json

{
  "clientId": "optional-client-id",
  "input": {
    "coaching_niche": "Executive Leadership",
    "target_audience": "C-suite executives at Fortune 500",
    "current_revenue": "500k_1m",
    "current_platforms": ["linkedin", "email"],
    "audience_size": {
      "linkedin": 5000,
      "email_list": 2000
    },
    "content_time_weekly_hours": 3,
    "primary_goal": "get_clients",
    "current_content_sources": ["podcast", "workshops"]
  }
}
```

### Upload Content
```bash
POST /api/upload
Content-Type: multipart/form-data

file: [audio/video/text file]
clientId: optional-client-id
```

### Run Pipeline on Piece
```bash
POST /api/pipeline/run/[pieceId]
```

### Run Pipeline on All
```bash
POST /api/pipeline/run-all
```

### Get Calendar
```bash
GET /api/calendar/[clientId]
```

### Get Repurposed Content
```bash
GET /api/content/[pieceId]
```

## Content Types Supported

| Type | Status |
|------|--------|
| Podcast Transcripts | ✓ Full support |
| Video Transcripts | ✓ Full support |
| Voice Memos | ✓ Full support |
| Text/Markdown | ✓ Full support |
| DOCX | ✓ Full support |
| PDF | ⚠️ Text extraction (may need review) |

## Platform Outputs

| Platform | Content Types |
|----------|--------------|
| LinkedIn | Story posts, Listicles, Insights, Questions, Hot takes, How-tos, Case studies |
| Twitter/X | Threads (3-15 tweets), Single tweets |
| Instagram | Captions, Carousel text, Hashtags |
| Email | Newsletter drafts, Subject lines, CTAs |
| Blog | SEO-optimized outlines, Meta descriptions |

## Deliverables Per Client (Monthly)

- **20-30 pieces of content** (across all platforms)
- **30-day posting calendar** (with optimal times)
- **Content series** (email sequences, blog series, etc.)
- **Strategy recommendations** (platform priorities, quick wins)

## Multi-Client Support

The system supports multiple clients with:
- Separate content libraries
- Client-specific strategies
- Individual calendars
- Platform credential management (for Tier 2)

## Tier 2 (White-Glove) Features

- VA assignment tracking
- Posting log (what's been posted, when)
- Metrics tracking (views, likes, comments)
- Weekly report generation

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
```

## License

Proprietary. Agent-Agent by RBB Ed.

---

**Agent-Agent Coaches Edition.**
Turn 1 hour of content into 30 days of posts.
