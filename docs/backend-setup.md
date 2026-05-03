# Backend Setup (Future Ready)

## App identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`

Current implementation does not require a backend for storefront operation. Studio remains a local prototype.

## Planned architecture (when needed)

- Keep production storefront static and continue serving from Vercel/Netlify.
- Add serverless endpoints for any write flows that require persistence.
- Preserve public storefront path while protecting admin operations behind auth.
- Use the existing Supabase Playground project only with isolated schema names.

## Safe migration approach

When backend features are approved:

1. Add tables only in `app_collected_edit_premium`.
2. Add RLS before first external exposure.
3. Add server-side key handling for admin actions.
4. Add migration scripts and docs alongside future tests.
5. Keep `.env` values in deployment platform secret storage only.
