# Deploying Agent-Agent Writers Edition to Vercel

## ⚠️ IMPORTANT: Root Directory Configuration

The Next.js app is located in the `writers-app/` subdirectory.

**You MUST configure the Root Directory in Vercel:**

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** (top navigation)
4. Click **General** (left sidebar)
5. Scroll to **Root Directory**
6. Click **Edit**
7. Enter: `writers-app`
8. Click **Save**
9. Go to **Deployments** and click **Redeploy**

Without this setting, Vercel will look for the app at the repository root and fail with:
```
Error: No Output Directory named "public" found
```

## Environment Variables

After setting the Root Directory, configure environment variables:

**Settings** → **Environment Variables** → **Add New**

### Required Variables

```bash
DATABASE_URL=file:./dev.db
LLM_MODE=mock
```

### Optional (for real LLM mode)

```bash
LLM_MODE=openai
OPENAI_API_KEY=sk-...your-key...
```

## Vercel Auto-Detection

Once Root Directory is set to `writers-app`, Vercel will auto-detect:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

These settings are handled automatically by Vercel's Next.js integration.

## Database Note

SQLite (`file:./dev.db`) works for development but is ephemeral on Vercel (resets on each deployment).

For production, consider:
- Vercel Postgres
- PlanetScale
- Supabase
- Railway Postgres

Update the `prisma/schema.prisma` datasource and `DATABASE_URL` accordingly.

## Prisma Generation

The build process automatically runs `npx prisma generate` via Next.js's build script. No additional configuration needed.

## Deployment Checklist

- [ ] Set Root Directory to `writers-app`
- [ ] Add `DATABASE_URL` environment variable
- [ ] Add `LLM_MODE` environment variable
- [ ] (Optional) Add `OPENAI_API_KEY` if using real LLM mode
- [ ] Redeploy from Deployments tab
- [ ] Verify build succeeds
- [ ] Test upload functionality
- [ ] Test pipeline execution

## Troubleshooting

### Build fails with Prisma errors
→ Verify `DATABASE_URL` is set in environment variables

### "No Output Directory named 'public' found"
→ Root Directory is not set. Follow steps above.

### Pages return 404 after deployment
→ Check that Root Directory is exactly `writers-app` (no trailing slash)

### Environment variables not working
→ Redeploy after adding variables (existing deployments don't auto-update)

## Alternative: Deploy from Subdirectory

If you prefer not to change Root Directory, you can:

1. Move `writers-app/` contents to repository root
2. Delete the `writers-app/` folder
3. Push changes
4. Vercel will auto-detect Next.js at root

But the Root Directory approach is cleaner for monorepo setups.
