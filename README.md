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

## Verification

```bash
pnpm check
```

The design documentation at the repository root remains the source of truth
for all interface work. Start with `AGENTS.md` before making changes.
