# The Collected Edit Premium

## App Identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`

## What this app is

A production-grade static storefront for a curated resale collection. The public experience includes:

- browse and filter searchable collection listings
- listing detail modal and copy-to-messenger message flow
- optional archived/sold section toggle
- mobile-optimized layout and lightweight static assets

This version also ships a local-only Studio prototype for editing data in the same browser. Studio changes are intentionally not production-shared and are not secured by authentication.

## Runtime classification

- Framework: static frontend (HTML/CSS/vanilla JS)
- Auth: none required for public access
- Backend: not active for now (future-ready only)
- API routes: none

## Authentication status for this deployment

| Item | Status |
| --- | --- |
| Existing auth found | No (only prototype Studio button flow, no credentials)
| Auth preserved | Not applicable |
| Auth required for current deployment | No |
| Temporary access mode added | N/A |
| Sensitive routes protected or hidden | Static studio data is clearly labeled prototype-only |

## Local verification

```bash
npm install
npm run verify
npm run build
```

Optional smoke test (requires Playwright browser runtime support):

```bash
npm run serve
npm run smoke:browser
```

`npm run build` is a verification pass; it does not produce a bundled artifact.

## Structure

Core static files:

- `index.html` — public storefront
- `admin.html` — local Studio prototype
- `styles.css` — shared styling
- `shared.js` — shared normalization and rendering helpers
- `app.js` — public storefront behavior
- `admin.js` — local Studio behavior
- `inventory-data.js` — bundled seed inventory and defaults
- `assets/` — brand and listing images
- `scripts/` — verification scripts

Platform and docs:

- `.gitignore`
- `.env.example`
- `package.json`
- `vercel.json`, `netlify.toml`
- `docs/deployment.md`
- `docs/backend-readiness.md`
- `docs/environment-variables.md`
- `docs/production-checklist.md`
- `docs/supabase-setup.md`
- `docs/backend-setup.md`
- `docs/security-review.md`

## Deployment targets

Preferred: Vercel static project using this same app slug.

- Project name: `collected-edit-premium`
- Framework preset: `Other`
- Build command: `npm run verify`
- Install command: `npm install`
- Output directory: `.`

Secondary: Netlify static publish target.

- Publish directory: `.`
- Build command: `npm run verify`
- Redirects and headers: `netlify.toml`

## Production posture

- No active secrets
- No active Supabase integration today
- Protected/provisioned backend features are documented for future activation only
