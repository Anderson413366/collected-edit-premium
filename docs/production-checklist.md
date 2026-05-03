# Production Checklist

## Before First Deploy

- [ ] Confirm app identity and platform route: `APP_NAME=The Collected Edit`, `APP_SLUG=collected-edit-premium`
- [ ] Remove placeholder Messenger URL in `inventory-data.js` if needed for production flow.
- [ ] Run `npm install`.
- [ ] Run `npm run verify`.
- [ ] Optional: run `npm run smoke:browser` (if browser runtime supports it).
- [ ] Confirm no secrets exist in repo/docs/outputs.
- [ ] Create GitHub repo `collected-edit-premium`.
- [ ] Create/verify isolated Vercel project `collected-edit-premium`.

## Vercel Checks

- [ ] Framework preset is `Other`.
- [ ] Install command is `npm install`.
- [ ] Build command is `npm run verify`.
- [ ] Output directory is `.`.
- [ ] No active app env vars are required.
- [ ] Security headers are present in production responses.

## Netlify Checks

- [ ] Publish directory is `.`.
- [ ] Build command is `npm run verify`.
- [ ] Redirects for `/admin` and `/studio` work.
- [ ] Security headers are present in production responses.

## Runtime Checks

- [ ] Homepage loads.
- [ ] Product cards render, search/filter operate.
- [ ] Modal opens and closes.
- [ ] Archive toggle renders sold archive.
- [ ] Copy message to clipboard works in HTTPS context.
- [ ] `admin.html` clearly shows prototype-only admin notice.
- [ ] Invalid Messenger URL is blocked in Studio settings.
- [ ] Mobile layout has no horizontal scroll.
- [ ] Browser console has no build/runtime blockers on launch.

## Future Backend Activation Checklist

- [ ] Create schema `app_collected_edit_premium` in Playground.
- [ ] Add tables and set RLS + policies.
- [ ] Add storage bucket before enabling uploads.
- [ ] Replace local Studio persistence with authenticated backend flows.
- [ ] Add backend smoke checks for read/write paths.
