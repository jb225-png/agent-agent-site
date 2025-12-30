# Agent-Agent: Writers Edition

A cognitive agent system that turns a writer's existing catalog into clear organization, placement decisions, product compilation, and repurposing outputs — with an executive queue that tells you exactly what to do next.

## Product Thesis

This is NOT a "talent agent." It does not hype, flatter, or "motivate." It cuts through the noise of your brain, organizes your catalog, and produces a clear path to making money.

The system makes DECISIONS, not endless suggestions.

## The 5 Agents

### 1. The Archivist (Sorting Agent)
**Goal:** Answer "What do I actually have?"

For each piece, outputs:
- Themes (3-8)
- Voice tags (e.g., "humor", "serious", "philosophical")
- Status (FINISHED, NEEDS_POLISH, FRAGMENT, SEED, ARCHIVE)
- Quality band (A/B/C: A = publish-ready, B = close, C = raw)
- Notes (short, ≤120 words)

### 2. The Placement Agent
**Goal:** Decide destination, not value.

Assigns exactly one primary lane:
- SUBMISSION (literary magazines, contests)
- PLATFORM (social media, newsletters)
- PRODUCT (ebooks, compilations)
- ARCHIVE (not ready)

Plus recommended next action and target outlets.

### 3. The Compiler (Product Agent)
**Goal:** Build sellable units.

Creates "Collections" from clustered pieces (e.g., ebook candidates) with:
- Working title and positioning
- Included pieces (ordered)
- Missing connective tissue (what to write)
- Effort estimate and price band
- Launch readiness

### 4. The Repurposer (Format Agent)
**Goal:** Convert AFTER placement is decided.

Rules:
- NEVER repurposes pieces held for submission
- For PLATFORM lane pieces, generates native-feeling outputs (threads read like threads, scripts sound spoken)
- Recommends formats in priority order
- Generates top 1-2 outputs only

### 5. The Executive (Queue Agent)
**Goal:** Decide what you do next.

Outputs a weekly queue with strict limits:
- Max 3 submission tasks
- Max 3 platform tasks
- Max 1 product task

Each task includes: why_now (≤40 words), step-by-step checklist, time estimate.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite + Prisma
- **UI:** Tailwind CSS (black & white only)
- **LLM:** OpenAI API (with mock mode for demo)
- **Validation:** Zod schemas

## Setup Instructions

### 1. Install Dependencies

```bash
cd writers-app
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# For demo/testing (no API calls)
LLM_MODE=mock

# For real LLM processing
# LLM_MODE=openai
# OPENAI_API_KEY=your-api-key-here

DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Uploading Content

1. Go to **Upload** page
2. Either:
   - **Upload files:** TXT, MD, DOCX, PDF, or ZIP containing multiple files
   - **Paste text:** Directly paste your writing with an optional title
3. Click "Upload & Process" or "Create & Process"
4. The system will ingest and automatically run the agent pipeline

### Viewing Your Library

1. Go to **Library** page
2. Use filters to view by:
   - **Lane:** SUBMISSION, PLATFORM, PRODUCT, ARCHIVE
   - **Status:** FINISHED, NEEDS_POLISH, FRAGMENT, SEED
   - **Quality:** A, B, C
3. Click any piece title to view detailed agent outputs

### Checking Collections

1. Go to **Collections** page
2. View ebook candidates compiled by The Compiler
3. See what's READY vs NEEDS_ASSEMBLY vs NEEDS_NEW_WRITING

### Getting Your Weekly Queue

1. Go to **Queue** page
2. See your weekly execution list with:
   - Submission tasks (max 3)
   - Platform tasks (max 3)
   - Product tasks (max 1)
3. Each task has a checklist and time estimate
4. See "Do Not Touch" list of protected pieces

## Running the Pipeline

The pipeline runs automatically after upload. To manually run:

### Run on Single Piece
```bash
POST /api/pipeline/run/[pieceId]
```

### Run on All Pieces
```bash
POST /api/pipeline/run-all
```

The pipeline executes in order:
1. **Archivist** → tags all pieces
2. **Placement** → assigns lanes
3. **Repurposer** → generates format conversions
4. **Compiler** → builds collections (catalog-level)
5. **Executive** → creates weekly queue (catalog-level)

## Mock Mode vs Real Mode

### Mock Mode (LLM_MODE=mock)
- No API calls
- Instant processing
- Deterministic outputs based on word count and simple rules
- Perfect for demo/testing

### Real Mode (LLM_MODE=openai)
- Calls OpenAI API (gpt-4o-mini)
- Requires OPENAI_API_KEY
- Validates all outputs with Zod schemas
- Retries once on validation failure
- Falls back to mock on persistent errors

## File Support

| Format | Status |
|--------|--------|
| TXT    | ✓ Full support |
| MD     | ✓ Full support |
| DOCX   | ✓ Extracts text with mammoth |
| PDF    | ⚠️ Attempts extraction; marks for manual review if fails |
| ZIP    | ✓ Extracts and processes contained files |

## Database Management

### View Database in Browser
```bash
npm run db:studio
```

### Reset Database
```bash
rm prisma/dev.db
npx prisma db push
```

### Backup Database
```bash
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

## Design Philosophy

### Black & White Only
No color accents. Clean, calm, professional.

### No Dashboard Dopamine
No charts, graphs, or gamification. Just data.

### Adult Tool
Lots of whitespace. Simple typography. Minimal UI.

### Decisions, Not Suggestions
The agents choose. They don't present options. They decide.

## Behavioral Constraints (Agents)

- No pep talk
- No generic advice
- Short, decisive outputs
- If uncertain, choose safest path (e.g., HOLD_FOR_SUBMISSION)
- Keep notes tight and useful

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to DB
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## Project Structure

```
writers-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/                   # Next.js app router pages
│   │   ├── api/               # API routes (upload, pipeline)
│   │   ├── library/           # Library page + piece detail
│   │   ├── collections/       # Collections page
│   │   ├── queue/             # Queue page
│   │   ├── upload/            # Upload page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── llm.ts             # LLM abstraction layer
│   │   └── schemas.ts         # Zod schemas for agents
│   ├── services/
│   │   ├── agents.ts          # Agent pipeline logic
│   │   └── ingestion.ts       # File ingestion service
│   └── data/
│       └── outlets.json       # Literary outlet database
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## Troubleshooting

### Upload fails with "Failed to parse DOCX"
- Some DOCX files with complex formatting may fail
- Try saving as plain text or pasting directly

### PDF extraction returns empty text
- PDFs with scanned images won't extract
- The system marks these for manual review
- Re-upload as text or paste content

### Pipeline runs but no results
- Check LLM_MODE in .env
- In openai mode, verify OPENAI_API_KEY is valid
- Check browser console and server logs for errors

### Database locked error
- Close Prisma Studio if open
- Restart dev server

## Future Enhancements (Not in MVP)

- Authentication/multi-user
- Cloud storage
- Real outlet database with submission tracking
- Export collections to DOCX/PDF
- Submission history tracking
- Email/calendar integration for deadlines

## License

Private MVP. No distribution.

---

**Agent-Agent Writers Edition.**
No hype. Just decisions.
