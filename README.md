# The Collected Edit Premium

## App identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`
- GitHub repository: `https://github.com/Anderson413366/collected-edit-premium`
- Production URL: `https://collected-edit-premium.vercel.app`

## What this app is

A production-grade static storefront with a local Studio prototype for inventory editing. It is intentionally deployable without login and without an active backend.

## Runtime classification

- Framework: static HTML/CSS/vanilla JS
- Auth: none required for public storefront access
- Backend: not active (future-ready only)

## What changed in this pass

- Verified app identity and treated this as a new deployment (`collected-edit-premium`).
- Cleaned and refreshed project docs for deployment/back-end readiness.
- Ensured deployment checks are source-of-truth and pass locally.
- Added future-ready backend setup docs and Supabase naming plan.
- Created fresh GitHub repository and production Vercel deployment.
- Added route handling consistency (`/admin`, `/studio` redirect to Studio prototype).

## Local verification

```bash
npm install
npm run verify
npm run build
```

Optional browser smoke (if Playwright runtime permits):

```bash
npm run serve
npm run smoke:browser
```

`npm run build` is a validation pass and does not generate a compiled bundle.

## Route behavior

- `/` and `/index.html`: storefront
- `/admin`: redirects to `/admin.html`
- `/studio`: redirects to `/admin.html`
- `/admin.html`: local Studio prototype (explicitly non-production)

## Files kept in production scope

- `index.html`, `admin.html`, `styles.css`
- `shared.js`, `app.js`, `admin.js`, `inventory-data.js`
- `assets/`
- `.env.example`, `.gitignore`, `package.json`, `package-lock.json`
- `vercel.json`, `netlify.toml`
- `docs/*`
- `scripts/*`

## Authentication status for this deployment

| Item | Status |
| --- | --- |
| Existing auth found | No (no username/password flow in production)
| Auth preserved | N/A |
| Auth required for current deployment | No |
| Temporary access mode added | N/A |
| Sensitive routes protected or hidden | Studio is prototype-only and clearly labeled local only |

## Deployment targets

Preferred: Vercel (`collected-edit-premium`) with `npm run verify` build.

Secondary: Netlify static with the same build command.

## Documentation

- [docs/deployment.md](docs/deployment.md)
- [docs/backend-readiness.md](docs/backend-readiness.md)
- [docs/environment-variables.md](docs/environment-variables.md)
- [docs/backend-setup.md](docs/backend-setup.md)
- [docs/supabase-setup.md](docs/supabase-setup.md)
- [docs/production-checklist.md](docs/production-checklist.md)
- [docs/security-review.md](docs/security-review.md)
