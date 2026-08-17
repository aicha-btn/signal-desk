# End-to-end testing

## Covered journey

The Playwright suite covers the main authenticated vertical slice:

1. provision a confirmed user in local Supabase;
2. sign in through the real SignalDesk interface;
3. synchronize the user in Rails;
4. create the first workspace through onboarding;
5. open the Control Room;
6. publish a Signal;
7. verify that it appears in the Signal Feed;
8. remove the temporary Rails and Supabase records.

The same run uses Axe across the authenticated journey and public entry points.
Dedicated regressions cover responsive reflow, skip links, custom-select keyboard
behavior, reduced-motion and public-form error recovery. It fails on any WCAG
2.2 A or AA violation.

## Run locally

Start the local Supabase services, install Chromium once, then run the suite:

```bash
pnpm supabase:start
pnpm test:e2e:install
pnpm test:e2e
```

Playwright starts Next.js and Rails when they are not already running. Failed
runs retain a trace, screenshot and video under `test-results/`.

## CI policy

The E2E suite is intentionally not attached to every push. Starting Supabase,
Rails, Next.js and Chromium for each small commit would consume substantially
more GitHub Actions minutes than the fast web/API checks. Run it before release
or after changes to authentication, onboarding, navigation or Signal creation.
