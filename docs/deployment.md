# Deployment Guide

## App identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`
- Repository: `https://github.com/Anderson413366/collected-edit-premium`
- Production URL: `https://collected-edit-premium.vercel.app`

## Local setup

```bash
npm install
npm run verify
npm run serve
```

Open:

- `http://127.0.0.1:5173` (public storefront)
- `http://127.0.0.1:5173/admin.html` (local Studio prototype)

## GitHub

Recommended repo name: `collected-edit-premium`.

Commit production files only and avoid secrets:

- Core app: `index.html`, `admin.html`, `styles.css`
- Runtime: `shared.js`, `app.js`, `admin.js`, `inventory-data.js`
- Config: `.gitignore`, `.env.example`, `package.json`, `package-lock.json`, `vercel.json`, `netlify.toml`
- Docs: `README.md`, `docs/*`
- Verification: `scripts/*`
- Assets: `assets/`

## Vercel setup

1. Create/import GitHub repo in Vercel.
2. Select framework preset `Other`.
3. Set install command `npm install`.
4. Set build command `npm run verify`.
5. Set output directory `.`.
6. Keep environment variables empty for this release.
7. Deploy and verify:
   - `https://collected-edit-premium.vercel.app`
   - `https://collected-edit-premium.vercel.app/admin`
   - `https://collected-edit-premium.vercel.app/studio`

### Route mapping details

- Vercel now uses 302 redirects for compatibility:
  - `/admin` → `/admin.html`
  - `/studio` → `/admin.html`

## Netlify setup

1. Set publish directory `.`
2. Set build command `npm run verify`
3. Use `netlify.toml` redirects for `/admin` and `/studio`.

## Post-deploy checks

- Homepage and product interactions are functional.
- Security headers are present in responses.
- `/admin` and `/studio` route to Studio.
- No committed secrets.
- Production checks are currently implemented in `.github`/repo docs and verified with `npm run verify` and remote `curl` checks.
