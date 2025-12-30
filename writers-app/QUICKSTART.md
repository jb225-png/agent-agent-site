# Quick Start Guide

## Get Running in 60 Seconds

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Set up database (if not already done)
npx prisma generate
npx prisma db push

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the Full Pipeline

1. **Go to Upload page** (`/upload`)

2. **Upload the sample content:**
   - Click "Upload Files"
   - Select files from `sample-content/` folder
   - Click "Upload & Process"

3. **View Results:**
   - Go to **Library** (`/library`) to see all pieces with agent tags
   - Click any piece to see detailed agent outputs
   - Go to **Collections** (`/collections`) to see compiled products
   - Go to **Queue** (`/queue`) to see your weekly execution list

## Sample Content Included

The `sample-content/` folder contains 4 example pieces:

- `essay-craft.md` - ~250 words, finished essay
- `short-thread-idea.txt` - ~100 words, platform content
- `memoir-fragment.txt` - ~120 words, fragment/seed
- `long-essay-incomplete.md` - ~450 words, needs polish

These will demonstrate different agent behaviors:
- Different quality bands (A/B/C)
- Different placement lanes (SUBMISSION/PLATFORM/PRODUCT)
- Different statuses (FINISHED/NEEDS_POLISH/FRAGMENT)
- Different recommended actions

## Current Mode

The app is running in **MOCK MODE** (see `.env`).

- No LLM API calls
- Instant processing
- Deterministic outputs

To switch to **REAL MODE** (OpenAI):

1. Edit `.env`:
   ```
   LLM_MODE=openai
   OPENAI_API_KEY=your-actual-api-key
   ```

2. Restart dev server

## What to Expect

**After Upload:**
- Pieces are parsed and stored
- Pipeline runs automatically
- All 5 agents process each piece
- Collections and queue are generated

**The Archivist** will tag each piece with themes, voice, status, and quality.

**The Placement Agent** will assign a primary lane and recommended action.

**The Compiler** will build collections from related pieces (needs 3+ finished pieces).

**The Repurposer** will generate format conversions (only for non-held pieces).

**The Executive** will create your weekly queue (max 3 submission + 3 platform + 1 product task).

## Explore the System

Try these actions:

1. Upload a short piece (< 400 words) → should route to PLATFORM lane
2. Upload a long piece (> 2000 words) → should route to SUBMISSION lane
3. Upload 5+ pieces → should generate collections
4. View the Queue to see prioritized tasks

## Need Help?

See the main [README.md](./README.md) for full documentation.

---

**Agent-Agent Writers Edition.**
Built and tested. Ready to organize your catalog.
