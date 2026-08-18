# Demo data

SignalDesk includes a local-only demo workspace for portfolio reviews and manual
product testing. It contains realistic customers, team roles, tags, Signals,
comments and activity history across every status, priority and source.

The deterministic dataset currently contains 18 Signals, 10 customers, seven
tags, eight members and 13 discussion comments.

## Create or reset the demo

Start the local Supabase stack and prepare Rails once:

```bash
pnpm supabase:start
pnpm db:prepare
```

Then run:

```bash
pnpm demo:seed
```

The command prints the login credentials and public form URL. It creates or
updates one confirmed user in local Supabase, then transactionally replaces the
workspace whose slug is `northstar-product-studio`.

The default local credentials are:

```text
Email: demo@signaldesk.test
Password: SignalDesk-Demo-2026!
```

They can be changed for a run with `DEMO_EMAIL`, `DEMO_PASSWORD` and
`DEMO_DISPLAY_NAME` environment variables.

## Safety and repeatability

The script refuses every Supabase URL whose hostname is not `localhost`,
`127.0.0.1` or `::1`. It never reads hosted credentials and never stores the
local service-role key. Re-running the command rebuilds only the dedicated demo
workspace, so screenshots and walkthroughs always start from the same state.

Production demo content uses the separate `pnpm demo:seed:production` command.
It requires `--confirm-production`, validates the fixed project and owner, and
writes generated secondary-account credentials to an ignored local file with
owner-only permissions. The local command cannot seed production by design.

The production command also requires `SUPABASE_DB_PASSWORD` in the invoking
shell and an authenticated Supabase CLI session. It never writes either the
database password or Supabase administrative keys to disk.
