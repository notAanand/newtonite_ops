# Known limitations

## Implemented in source

- Team scoped JWT authentication, membership checks, role-gated writes, and Lead-gated approval.
- PostgreSQL Prisma schema with indexed item listing, comments, activity, idempotency records, and outbox jobs.
- Create/list/detail/update/comment/activity/dashboard API routes.
- Atomic version checks and item/activity transactions.
- Idempotent item creation with request fingerprints and a database uniqueness constraint.
- Responsive React UI for login, dashboard, list/search/status filter, create, detail, comments, and activity.

## Not implemented or not yet verified

- No background worker claims or retries `OutboxJob`; no producers are wired to it. It is a schema foundation only.
- No admin UI or team membership mutation API. Admin has no cross-team or global privilege.
- Assignee filtering exists in the API; the UI does not expose every API filter, and the table does not yet offer cursor “load more”.
- Frontend detail view does not expose general field editing, due dates after creation, or a claim button. Use the API for these fields.
- Tests do not yet exercise PostgreSQL transaction rollback, concurrent claims, idempotency races, or cross-team isolation. A real PostgreSQL test database and integration suite remain necessary before asserting those behaviors.
- Docker Compose starts only PostgreSQL. API and web run through the documented npm scripts.
- No production scale/load testing, deployment hardening, email notifications, or retention/cleanup task.
- Demo seed currently generates 30 sample records, not thousands.
- `npm audit --omit=dev` reported three high severity advisories in Prisma CLI configuration tooling via `@prisma/config` / `deepmerge-ts`. No forced or unverified dependency override was applied; review the advisory and update Prisma tooling to a patched compatible release before production use.
