# SignalDesk

SignalDesk is a monorepo with a Next.js frontend and a Rails API. Supabase
provides authentication and PostgreSQL infrastructure; Rails owns all business
data and rules.

## Applications

- `apps/web`: Next.js App Router, TypeScript and Tailwind CSS.
- `apps/api`: Rails API-only application backed by PostgreSQL.
- `supabase`: local Supabase services and configuration.

## Local setup

Install Homebrew, then install the local tools:

```bash
brew install mise colima docker
mise install
pnpm install
```

Start the container runtime and local Supabase stack:

```bash
colima start --cpu 2 --memory 4 --disk 20
pnpm supabase:start
pnpm db:prepare
```

Run Next.js and Rails together:

```bash
pnpm dev
```

- Web: http://localhost:3000
- API health: http://localhost:3001/up
- Versioned API health: http://localhost:3001/api/v1/health

Create a complete presentation workspace with a confirmed local account:

```bash
pnpm demo:seed
```

The command is idempotent and local-only. It prints the demo credentials and
public Signal form URL when it finishes. See `docs/demo-data.md` for the dataset
and safety guarantees.

## Verification

```bash
pnpm check
```

The release check adds the real browser journey and accessibility scans:

```bash
pnpm test:e2e:install
pnpm check:release
```

The E2E suite provisions a temporary confirmed user in local Supabase, signs in,
creates a Rails workspace, publishes a Signal and removes all temporary records.
See `docs/end-to-end-testing.md` for its scope and CI policy.

## Authenticated flow

Supabase Auth owns credentials and cookie sessions. Next.js verifies the session,
forwards the access token to Rails, and Rails validates its ES256 signature against
the Supabase JWKS endpoint before applying Pundit policies.

The first authenticated request synchronizes the Rails `User`. Onboarding then
creates a `Workspace` and an `owner` `Membership` in one transaction. Business
tables have RLS enabled with no direct browser policies; Rails remains their only
application access path.

## Public Signal form

Workspace owners and admins can enable a public feedback URL from Settings. The
form creates feedback through Rails without requiring a SignalDesk account. It
uses strict input limits, a honeypot, origin-restricted CORS and Rails rate limits;
no CAPTCHA, Redis or additional anti-abuse service is required for the current
single-process deployment. See `docs/public-signal-form.md` for the full contract.

## Production

- Web: https://signal-desk-lake.vercel.app
- API: https://signal-desk-api-5jsn.onrender.com
- Vercel project: `signal-desk`, with `apps/web` as its Root Directory.
- Render service: Rails Docker deployment from `apps/api`, defined by
  `render.yaml` at the repository root.
- Supabase: hosted Auth and PostgreSQL project.

Vercel requires `RAILS_API_URL`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Render requires `DATABASE_URL`, `RAILS_MASTER_KEY`, `SUPABASE_URL`,
`SUPABASE_JWT_AUDIENCE=authenticated`, `SUPABASE_JWT_ALGORITHM=ES256`,
`APP_URL`, `RESEND_API_KEY`, and `MAILER_FROM`. See
`docs/resend-invitations.md` for the invitation email setup.

The design documentation at the repository root remains the source of truth
for all interface work. Start with `AGENTS.md` before making changes.
