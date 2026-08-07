# SignalDesk API

Rails 8.1 API-only application. Rails owns all business data, authorization,
validation and PostgreSQL migrations.

Run commands from the repository root whenever possible:

```bash
pnpm db:prepare
pnpm dev:api
pnpm test:api
pnpm lint:api
```

The liveness endpoint is `/up`. The versioned health endpoint at
`/api/v1/health` also verifies the PostgreSQL connection.
