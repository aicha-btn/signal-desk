# Architecture

SignalDesk separates rendering, identity and domain ownership while keeping the
number of external services small. The central rule is simple: Next.js owns the
experience, Rails owns business behavior, and Supabase owns identity plus the
PostgreSQL infrastructure.

## System topology

```mermaid
flowchart TB
  subgraph Client["Client"]
    Browser["Desktop or mobile browser"]
  end

  subgraph Vercel["Vercel"]
    Next["Next.js App Router"]
    Actions["Server Components and Server Actions"]
    Next --> Actions
  end

  subgraph Supabase["Supabase"]
    Auth["Auth and ES256 JWKS"]
    Postgres["PostgreSQL"]
  end

  subgraph Render["Render"]
    Rails["Rails 8 JSON API"]
    Policies["Pundit policies"]
    Domain["Active Record models and services"]
    Rails --> Policies --> Domain
  end

  Resend["Resend email API"]

  Browser <-->|"HTML, RSC and form actions"| Next
  Actions <-->|"Session cookies"| Auth
  Actions -->|"HTTPS + bearer token"| Rails
  Rails -->|"JWKS fetch and cache"| Auth
  Domain -->|"TLS database connection"| Postgres
  Rails -->|"Action Mailer"| Resend
```

## Authenticated request

```mermaid
sequenceDiagram
  participant B as Browser
  participant N as Next.js
  participant S as Supabase Auth
  participant R as Rails API
  participant P as PostgreSQL

  B->>N: Request protected route
  N->>S: Read and verify cookie session
  S-->>N: User and access token
  N->>R: API request with bearer token
  R->>S: Verify ES256 signature using JWKS
  R->>R: Sync minimal user identity
  R->>R: Scope workspace with Pundit
  R->>P: Query or mutate business records
  P-->>R: Constrained relational result
  R-->>N: JSON response
  N-->>B: Rendered UI or action result
```

Supabase credentials and refresh tokens never enter Rails. Rails receives only
the access token required to establish identity. Conversely, the Supabase
browser client never receives policies that expose SignalDesk business tables.

## Domain ownership

Rails owns these relational boundaries:

- `User` mirrors only the stable Supabase subject, email and display name.
- `Workspace` is the tenant boundary.
- `Membership` joins users to a workspace with owner, admin or member roles.
- `Feedback`, presented as a Signal, belongs to exactly one workspace.
- `Customer`, `Tag`, `Comment` and `ActivityEvent` are validated against the same
  workspace as their parent Signal.
- `WorkspaceInvitation` stores a token digest, role, expiry, inviter and
  acceptance state.

Application services group writes that must succeed atomically. Creating a
Signal also creates its audit event; commenting and state changes follow the
same transaction rule.

## Trust boundaries

```mermaid
flowchart LR
  Public["Untrusted public input"] --> Guard["CORS, limits, honeypot, rate limit"]
  Guard --> PublicAPI["Public Rails endpoint"]
  Session["Verified Supabase session"] --> AuthAPI["Authenticated Rails endpoints"]
  AuthAPI --> Scope["Pundit policy scope"]
  PublicAPI --> Validation["Active Record validation"]
  Scope --> Validation
  Validation --> Constraints["PostgreSQL constraints + RLS enabled"]
```

The public form can create a new Signal but cannot list, read or update any
workspace resource. Authenticated routes first scope a workspace from the
current user rather than accepting tenant identity on trust from the client.

## Deployment

```mermaid
flowchart LR
  Main["GitHub main"] --> CI["Path-filtered GitHub Actions"]
  Main --> VDeploy["Vercel deployment"]
  Main --> RDeploy["Render Docker deployment"]
  CI --> WebChecks["ESLint + Next build"]
  CI --> APIChecks["RuboCop + RSpec + Brakeman"]
  VDeploy --> Web["signal-desk-lake.vercel.app"]
  RDeploy --> API["signal-desk-api-5jsn.onrender.com"]
```

Vercel uses `apps/web` as its Root Directory, so the monorepo does not publish
Rails as a frontend artifact. Render independently uses `apps/api` as its root
and builds the committed Dockerfile. Each provider reports deployment state for
the same Git commit.

## Local parity

Local development keeps the same ownership boundaries:

- Next.js runs on port `3000`.
- Rails runs on port `3001`.
- the Supabase CLI runs Auth and PostgreSQL locally;
- `pnpm demo:seed` provisions a local identity through the Supabase admin API,
  then calls a Rails service to build the domain dataset.

The E2E suite uses the same provisioning route and deletes its temporary user
and records after each complete browser journey.
