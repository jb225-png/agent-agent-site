# Deploying Agent-Agent Writers Edition to Vercel

## Quick Deploy

The repository is pre-configured with `vercel.json` and a root `package.json` that automatically handle the subdirectory setup. Just push and deploy!

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

## How It Works

The Next.js app is in `writers-app/` subdirectory. The build is configured via:

- **`vercel.json`** - Specifies build commands and output directory
  ```json
  {
    "buildCommand": "cd writers-app && npx prisma generate && npm run build",
    "outputDirectory": "writers-app/.next",
    "installCommand": "cd writers-app && npm install"
  }
  ```

- **`package.json`** (root) - Delegates scripts to subdirectory for local dev consistency

Vercel automatically detects these and builds correctly.

## Build Process

When you push to GitHub, Vercel will:

1. Run `cd writers-app && npm install`
2. Run `cd writers-app && npx prisma generate` (creates Prisma client)
3. Run `cd writers-app && npm run build` (builds Next.js)
4. Serve from `writers-app/.next` output directory

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
- [ ] Connect repository to Vercel (if not already)
- [ ] Add `DATABASE_URL` environment variable
- [ ] Add `LLM_MODE` environment variable
- [ ] (Optional) Add `OPENAI_API_KEY` for real LLM mode
- [ ] Deploy
- [ ] Test upload functionality
- [ ] Test pipeline execution

## Troubleshooting

### Build fails with "Cannot find module '@prisma/client'"
→ This is fixed - Prisma is generated in build command

### Environment variables not working
→ Redeploy after adding variables (doesn't auto-apply to existing deployments)

### Pages return 500 errors
→ Check Vercel logs (Deployments → select deployment → Runtime Logs)
→ Verify `DATABASE_URL` is set correctly

### Uploaded pieces disappear after deployment
→ Expected with SQLite - migrate to hosted database for persistence

## Local Development

```bash
cd writers-app
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Alternative: Move to Root

If you prefer to simplify, you can move everything to the repository root:

```bash
# Move writers-app contents to root
mv writers-app/* .
mv writers-app/.* . 2>/dev/null
rm -rf writers-app

# Delete monorepo config files
rm package.json vercel.json

# Push changes
git add -A
git commit -m "Move Next.js app to repository root"
git push
```

Vercel will auto-detect Next.js at root and deploy normally.
