# Architecture

```text
React + React Router + TanStack Query
                │ JSON / Bearer JWT
                ▼
Express modular monolith ── Zod / Helmet / CORS / rate limit
                │ Prisma transactions and authorization
                ▼
PostgreSQL: users, team memberships, work items, activity, comments,
            idempotency records, outbox jobs
```

Authorization is resolved from the authenticated user and team membership in the API. Lists are filtered and paginated in PostgreSQL. Work item updates compare the expected version in the update predicate. Item state and its activity record are committed together. Optional create idempotency state shares the transaction with the newly created item.

## Workflow

`OPEN -> IN_PROGRESS -> AWAITING_APPROVAL -> RESOLVED -> CLOSED`

Reopen a resolved item with `RESOLVED -> IN_PROGRESS`. Invalid transitions return 409. Only a team Lead may move `AWAITING_APPROVAL` to `RESOLVED`.
