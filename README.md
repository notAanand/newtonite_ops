# Newtonite Ops — Operations Under Pressure

An internal operations workspace for tracking incidents, customer issues, payment problems, compliance work, and general tasks. The application is a TypeScript modular monolith: a React/Vite client talks to an Express API, which uses Prisma and PostgreSQL.

## Requirements

- Node.js 20+ and npm 10+
- Docker Desktop with Compose

## Run locally

```powershell
Copy-Item .env.example .env
docker compose up -d db
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:5173. The API health endpoint is http://localhost:4000/api/health. Set a private random `JWT_SECRET` in `.env` before sharing a running instance. Demo seed password can be changed with `SEED_DEMO_PASSWORD` before seeding.

For a hosted PostgreSQL database, put its connection URL in `.env` as `DATABASE_URL` and skip `docker compose up -d db`. Keep `.env` private; it is ignored by Git.

## Demo accounts

All accounts use the password in `SEED_DEMO_PASSWORD` (default `NewtoniteDemo!2026`).

| Email | Team | Role |
| --- | --- | --- |
| alex@newtonite.local | Operations and Payments | Lead / Member |
| priya@newtonite.local | Operations | Member |
| sam@newtonite.local | Operations | Viewer |
| jordan@newtonite.local | Payments | Lead |
| casey@newtonite.local | Payments | Member |
| riley@newtonite.local | Payments | Member |
| morgan@newtonite.local | Trust & Compliance | Admin |
| jamie@newtonite.local | Trust & Compliance | Lead |
| avery@newtonite.local | Trust & Compliance | Member |
| taylor@newtonite.local | Trust & Compliance | Viewer |

Seed creates a few dozen sample items across three teams. These identities are for local demonstration only.

## API overview

- `POST /api/auth/login`
- `GET /api/teams`
- `GET /api/dashboard`
- `GET /api/items?teamId=…&limit=…&cursor=…&q=…&status=…&priority=…&assigneeId=…`
- `POST /api/items` (optional `Idempotency-Key` header)
- `GET /api/items/:id`
- `PATCH /api/items/:id` (requires `expectedVersion`)
- `GET/POST /api/items/:id/comments`
- `GET /api/items/:id/activity?limit=…&cursor=…`
- `GET /api/health`

All `/api` routes except login and health require a Bearer JWT. Team membership is checked on every team-scoped operation. Pagination is cursor based and bounded to 100 rows.

## Tests and builds

```powershell
npm test
npm run build
```

## Walkthrough

1. Sign in as Alex, select a team, and review assigned, urgent, and approval queues.
2. Create an item and open its detail page.
3. Add a comment; see it appear in the activity timeline.
4. Progress the item through the workflow. Use a Lead account to approve it.
5. Sign in as Sam to see the read-only experience; the API rejects write attempts even if sent outside the UI.

## Limitations

See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) and [ENGINEERING_DECISIONS.md](ENGINEERING_DECISIONS.md). The outbox table is included in the database foundation, while no delivery worker is started. The current integration test suite is intentionally small; PostgreSQL-backed concurrency cases should be run against a dedicated test database before production use.
