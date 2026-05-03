# Deployment Guide

## App identity

- App name: `collected-edit-premium`
- App slug: `collected-edit-premium`

## Local setup

Prerequisites:

- Node.js 20 or newer
- npm
- Python 3 (optional local static server)

```bash
npm install
npm run verify
npm run serve
```

Open `http://127.0.0.1:5173` for the storefront and `/admin.html` for the prototype Studio.

## GitHub preparation

Recommended repo name: `collected-edit-premium`

Commit these production files:

- `index.html`, `admin.html`, `styles.css`
- `shared.js`, `app.js`, `admin.js`, `inventory-data.js`
- `assets/`
- `.gitignore`, `.env.example`, `package.json`, `package-lock.json`
- `vercel.json`, `netlify.toml`
- `README.md`, `docs/`
- `scripts/`

Never commit:

- `.env`
- `.env.local`
- `.env.production`
- `node_modules/`
- `.vscode/` (except user-level settings)
- secrets or service credentials

## Platform choice

Primary recommendation: Vercel

Why:

- Clean static deployment on `collected-edit-premium`
- Existing rewrite/header config already matches storefront and Studio routes
- Easy production verification for security headers and health flow

Secondary option: Netlify static hosting

## Vercel configuration

1. Create/connect GitHub repo in Vercel.
2. Framework preset: `Other`.
3. Install command: `npm install`.
4. Build command: `npm run verify`.
5. Output directory: `.`.
6. Keep environment variables empty for now (no active backend).
7. Deploy.

## Netlify configuration

1. Create/connect GitHub repo in Netlify.
2. Set publish directory: `.`
3. Set build command: `npm run verify`.
4. Keep `netlify.toml` in place.

## Post-deploy verification

- Homepage loads
- Listing grid and filters work
- Product modal opens/closes
- Archive toggle works
- `admin.html` is labeled prototype-only
- Messenger URL behavior handles missing/invalid values
- `Content-Security-Policy` and related security headers are present
- No secrets are in repo artifacts
- Production URL responds over HTTPS
