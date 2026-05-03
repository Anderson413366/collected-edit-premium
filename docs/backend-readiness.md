# Backend and Supabase Readiness

## App identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`

Backend Status: **Prepared for Future Use**

Supabase Status: **Prepared for Future Use**

## Current implementation

- No active backend, database, auth sessions, or server routes are required for the storefront.
- Studio is local-only and writes only to browser `localStorage`.
- Any inquiry/contact behavior remains client-driven with Messenger links.

## Why backend is not active yet

A real backend would be added only when shared editing, protected admin workflows, inquiry persistence, or remote uploads/storage are required. Keeping it future-ready avoids unnecessary operational complexity.

## Prepared extension points

- `.env.example` contains future-ready variable slots.
- Security headers are in platform configs (`vercel.json`, `netlify.toml`).
- Frontend code separates shared helpers (`shared.js`) from storefront (`app.js`) and Studio (`admin.js`) flows.
- Admin workflow is intentionally marked prototype-only so it is safe to ship as static for now.

## Supabase schema separation plan (future)

When activation is approved, use a dedicated schema in the shared Playground project:

- Project: `Playground` (`qbnetjcztbsbnzuwrigk`)
- Schema: `app_collected_edit_premium`

Suggested tables:

- `app_collected_edit_premium.site_settings`
- `app_collected_edit_premium.listings`
- `app_collected_edit_premium.listing_images`
- `app_collected_edit_premium.inquiries`

Suggested storage bucket:

- `app-collected-edit-premium-images`

## Future rollout order

1. Provision shared schema and tables.
2. Enable RLS and policy boundaries before first read/write from client.
3. Add authenticated admin route or server-side endpoint.
4. Replace local `localStorage` Studio with backend-backed operations.
5. Add migration and schema docs in the same repo.
