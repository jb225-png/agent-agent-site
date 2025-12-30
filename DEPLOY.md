# Deploying Agent-Agent Writers Edition to Vercel

## Quick Deploy

The Next.js app is now at the repository root. Vercel will auto-detect and deploy it automatically.

1. Push to GitHub
2. Vercel auto-deploys
3. Add environment variables (see below)
4. Done!

## Environment Variables Required

In Vercel project settings (**Settings** → **Environment Variables**), add:

### Required
```bash
DATABASE_URL=file:./dev.db
LLM_MODE=mock
```

### Optional (for real OpenAI integration)
```bash
LLM_MODE=openai
OPENAI_API_KEY=sk-your-key-here
```

## Vercel Auto-Detection

Vercel automatically detects:
- **Framework**: Next.js
- **Build Command**: `npm run build` (runs `next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x (from package.json engines or Vercel default)

The `build:vercel` script in package.json runs `prisma generate && next build` if needed.

## Database Considerations

⚠️ **SQLite is ephemeral on Vercel** - the database resets with each deployment.

For production persistence, migrate to a hosted database:
- **Vercel Postgres** (recommended, easy integration)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)

To migrate:
1. Update `prisma/schema.prisma` datasource to PostgreSQL/MySQL
2. Update `DATABASE_URL` environment variable in Vercel
3. Run `npx prisma db push` to create tables
4. Redeploy

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Vercel auto-deploys (or connect repo if first time)
- [ ] Add `DATABASE_URL` environment variable
- [ ] Add `LLM_MODE` environment variable
- [ ] (Optional) Add `OPENAI_API_KEY` for real LLM mode
- [ ] Verify deployment succeeds
- [ ] Test upload functionality
- [ ] Test pipeline execution

## Local Development

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Troubleshooting

### Build fails with "Cannot find module '@prisma/client'"
→ Vercel should auto-run prisma generate via postinstall
→ If not, check that prisma is in devDependencies

### Environment variables not working
→ Redeploy after adding variables (doesn't auto-apply to existing deployments)
→ Go to Deployments → select deployment → click "Redeploy"

### Pages return 500 errors
→ Check Vercel logs: Deployments → select deployment → Runtime Logs
→ Verify `DATABASE_URL` is set correctly
→ Check for missing environment variables

### Uploaded pieces disappear after deployment
→ Expected with SQLite - migrate to hosted database for persistence

### First deployment after moving to root
→ If you had previous failed deployments, Vercel will retry automatically
→ Or manually trigger: Deployments → click "Redeploy"

## Build Configuration

No special configuration needed! Vercel's Next.js integration handles everything automatically when the app is at the repository root.

If you need to customize:
- Go to Project Settings → General → Build & Development Settings
- Framework Preset: Next.js (auto-detected)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
