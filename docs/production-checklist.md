# Production Checklist

## Before First Deploy

- [x] App identity confirmed: `The Collected Edit` / `collected-edit-premium`
- [x] No active backend dependency required for storefront.
- [x] Local static verification passes (`npm run verify`).
- [ ] Optional browser smoke: `npm run smoke:browser` (blocked in current environment due Playwright browser permission issue; run in a local interactive machine/CI if needed).
- [x] Created dedicated GitHub repo: `Anderson413366/collected-edit-premium`.
- [x] Created dedicated Vercel project: `collected-edit-premium`.

## Runtime Checks

- [x] Homepage loads on production URL.
- [x] Product grid/search/filter renders.
- [x] Product modal opens and closes.
- [x] Archive toggle works.
- [x] `admin` route rewrites to Studio.
- [x] `studio` route rewrites to Studio.
- [x] Security headers returned by Vercel.

## Ongoing Security Checks

- [x] No committed `.env` files.
- [x] Static security headers present.
- [x] No service credentials in browser code.

## Future Backend Activation Checklist

- [ ] Create schema `app_collected_edit_premium` in Supabase Playground.
- [ ] Enable and test RLS before exposing any write APIs.
- [ ] Add authenticated admin endpoints.
- [ ] Add storage bucket + upload policy.
- [ ] Extend tests for data-read/write flows.
