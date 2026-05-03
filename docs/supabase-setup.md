# Supabase Setup (Future)

## Project target

- Project name: Playground
- Project ID: qbnetjcztbsbnzuwrigk

## Current status

No Supabase objects for this app are active today.

## Planned separation

Recommended namespace:

- `app_collected_edit_premium`

Recommended storage bucket:

- `app-collected-edit-premium-images`

## Guardrails

- Never create or modify objects in other apps’ schemas.
- Never use public tables or buckets for app-protected data.
- Enable RLS and write strict policies before sharing data.
- Keep admin/service credentials server-side only.
