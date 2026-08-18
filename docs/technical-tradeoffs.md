# Technical tradeoffs

SignalDesk is a portfolio-scale SaaS designed to demonstrate production-minded
boundaries without accumulating services that the current workload does not
need. These decisions are intentional rather than invisible shortcuts.

## Next.js and Rails in one monorepo

**Choice:** keep the App Router frontend and Rails API in one repository, with
independent provider roots and deployments.

**Benefit:** atomic product changes, one review surface, shared documentation and
a clear demonstration of both ecosystems.

**Cost:** two runtimes, two build pipelines and more local orchestration than a
single full-stack framework.

## Supabase for identity, Rails for business data

**Choice:** use Supabase Auth for credentials and sessions while routing all
business reads and writes through Rails.

**Benefit:** authentication is delegated to a focused provider, while Rails
keeps one authoritative validation, authorization and transaction layer.

**Cost:** Next.js must forward access tokens and Rails must verify remote JWKS.
The project cannot use Supabase's direct browser data access for business tables.

## RLS enabled without browser policies

**Choice:** enable PostgreSQL RLS on business tables but expose no direct browser
policies; the Rails database connection remains the only application path.

**Benefit:** a narrower data surface and no duplicated authorization logic
between Pundit and SQL policies.

**Cost:** RLS is a defensive boundary here, not the primary tenant-enforcement
mechanism. Every Rails query still has to be correctly scoped and tested.

## Server-rendered interaction model

**Choice:** prefer Server Components and Server Actions over a client-side data
store and broad optimistic cache.

**Benefit:** fewer client dependencies, session-aware rendering and explicit
mutation paths. Pending states, navigation feedback and error recovery stay
centralized in the design system.

**Cost:** some actions wait for a server round trip, and careful pending feedback
is required so the interface never feels inert.

## In-process public-form protection

**Choice:** combine strict limits, honeypot validation, origin-restricted CORS
and in-process rate limiting instead of adding CAPTCHA or Redis.

**Benefit:** no extra vendor, cookie banner or challenge friction for the current
single-instance deployment.

**Cost:** counters are not shared across multiple Rails instances and reset on a
deploy. Horizontal scaling would require a shared limiter such as Redis or an
edge protection layer.

## Synchronous invitation email

**Choice:** send low-volume invitations through Action Mailer and Resend during
the request rather than operating a background job service.

**Benefit:** one external email provider and a small failure surface.

**Cost:** provider latency is part of the request. Higher volume would justify
Active Job with durable asynchronous processing and retry policy.

## Manual serializers

**Choice:** keep small JSON serializers next to the Rails controllers instead of
adding Jbuilder or a serializer gem.

**Benefit:** response contracts remain explicit and dependency-free at the
current API size.

**Cost:** serializers should move into dedicated objects if response variants or
cross-controller reuse grow significantly.

## Free-tier deployment

**Choice:** deploy Next.js to Vercel, Rails to Render and Auth/PostgreSQL to
Supabase using their low-cost tiers during portfolio development.

**Benefit:** the product has real independent deployments without committing to
fixed infrastructure spend before it has users.

**Cost:** the Rails service can cold-start and free quotas are finite. This is
acceptable for a portfolio environment, not a production SLA.

## Focused CI

**Choice:** run separate web and API jobs only when code, dependencies or the CI
workflow changes. Keep the slower browser suite in the explicit release command.

**Benefit:** recruiters can inspect a real CI pipeline while routine documentation
pushes do not consume unnecessary minutes.

**Cost:** a merge can be green without running Playwright in GitHub Actions. The
release process therefore requires `pnpm check:release` locally before the final
push and verifies Vercel and Render afterward.

## Deferred services

The current product deliberately does not add analytics, error tracking, Redis,
a job platform, file storage, billing or a CAPTCHA. Each has a plausible future
role, but adding them before a measured need would increase credentials, failure
modes, privacy surface and maintenance cost without improving the core Signal
workflow.
