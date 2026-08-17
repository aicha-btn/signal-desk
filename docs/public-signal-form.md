# Public Signal form

## Purpose

Each workspace may expose a public, no-login URL at `/forms/:slug`. Submissions
enter the same Signal Feed as authenticated feedback and remain governed by Rails.
The browser never writes directly to Supabase.

## Activation

1. Open `Settings` as an owner or admin.
2. Enable `Public Signal line`.
3. Save the setting.
4. Copy or preview the generated public URL.

Members may read workspace settings but cannot change this option. A disabled or
unknown workspace returns `404` for both form discovery and submission.

## Request contract

- `GET /api/v1/public/forms/:slug` exposes only the workspace display name and slug.
- `POST /api/v1/public/forms/:slug/feedbacks` accepts a required title and
  description plus optional name, company and email.
- Rails creates a `Customer` only when an email is present.
- The resulting feedback uses source `public_form`, status `new` and priority
  `medium`, and records an `ActivityEvent` without an authenticated actor.

## Protection

- title: 5 to 160 characters;
- description: 20 to 4,000 characters;
- optional contact fields have strict maximum lengths and email validation;
- an invisible honeypot absorbs basic automated submissions with a neutral `201`;
- burst limit: 5 submissions per IP and workspace every 10 minutes;
- daily limit: 30 submissions per IP and workspace;
- rejected rate-limited requests return `429` with `Retry-After`;
- CORS allows only the configured SignalDesk web origin and local development.

The limits use Rails' built-in controller rate limiting with an in-memory cache.
This is deliberate while Render runs one web process: it avoids Redis and another
external service. Before scaling Rails to several processes or instances, move the
rate-limit store to a shared cache such as Redis.

## Privacy and logs

Contact details are optional. Public endpoints do not reveal internal workspace
IDs, members or settings. Anti-abuse logs contain only the rejection reason and
request ID, never the submitted message or contact fields.

## Verification

The request specs cover enabled and disabled workspaces, anonymous and identified
submissions, validation, honeypot behavior, rate limiting, CORS and role-based
configuration. Run all checks with:

```bash
pnpm check
```
