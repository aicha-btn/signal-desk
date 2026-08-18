# Demo data

SignalDesk includes a local-only demo workspace for portfolio reviews and manual
product testing. It contains realistic customers, team roles, tags, Signals,
comments and activity history across every status, priority and source.

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

Production demo content must be created through a separate, explicit release
procedure. This local command cannot seed production by design.
