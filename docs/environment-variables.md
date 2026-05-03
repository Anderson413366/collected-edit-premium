# Environment Variables

## App identity

- App name: `The Collected Edit`
- App slug: `collected-edit-premium`

## Active variables

None.

## Future-ready public variables

```env
PUBLIC_SITE_URL=
NEXT_PUBLIC_AUTH_MODE=disabled
```

## Future-ready private server variables

```env
AUTH_REQUIRED=false
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
```

## Notes

- Keep private keys server-side only.
- Do not commit real values.
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel/Netlify only if server-side routes are added.
- Keep `AUTH_REQUIRED=false` until explicit auth launch is approved.
