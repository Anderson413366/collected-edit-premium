# Security Review

## Executive summary

No committed production secrets were found in this static release. The remaining risk surface is intentional operational exposure from a local-only Studio prototype and the absence of authentication for local editing.

## Current security posture

- Production storefront is static and public.
- Admin Studio is intentionally local-only and not a privileged shared admin surface.
- No API routes, auth callbacks, or database connections are currently active.
- Security headers are explicitly configured in `vercel.json` and `netlify.toml`.
- `.env`/secret data is not required for this deployment.

## Verified mitigations

1. No embedded credentials or service keys in shipped source.
2. Messenger URL accepts only Facebook-approved destination patterns in UI logic.
3. Image and listing fields are sanitized and normalized before rendering.
4. Local `localStorage` writes are bounded by normalization and field limits.

## Remaining concerns

- Local Studio edits are browser-local and are not suitable for shared admin workflows.
- Supabase/backend security controls are not active because backend is not enabled yet.

## Recommended follow-up when backend is activated

- Enforce authentication and authorization for edit routes.
- Add RLS on all Supabase tables.
- Keep private keys server-side only.
- Add audit logs for sensitive admin changes.
