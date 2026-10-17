# Engineering decisions

## 1. Transactional item history

- **Context:** Changes must be auditable and history must not diverge from state.
- **Options:** Write activity asynchronously; write it separately; write both in one transaction.
- **Selected:** Item mutation and its activity record run in one Prisma transaction.
- **Trade-offs:** A history insert failure rejects the update, preserving consistency at some availability cost.
- **Fit:** This demonstrates database-level atomicity without introducing a distributed system.

## 2. Optimistic concurrency

- **Context:** Two operators can edit the same item at once.
- **Options:** Last-write-wins; database locks; caller-supplied version compare-and-swap.
- **Selected:** Clients send `expectedVersion`; update uses `WHERE version = expectedVersion` and increments it atomically.
- **Trade-offs:** A stale client must refresh and reconcile its edits.
- **Fit:** Easy to explain and handles concurrent claims and stale updates with PostgreSQL row updates.

## 3. Team-scoped authorization

- **Context:** Users may have different roles in multiple teams.
- **Options:** Global roles; client-only filtering; a membership lookup for each request.
- **Selected:** Role belongs to `(userId, teamId)` membership; resource lookup precedes an authorization check.
- **Trade-offs:** Membership reads add a small database query.
- **Fit:** The API makes team boundaries explicit and returns 404 for resources outside a user's membership scope.

## 4. Idempotent creation

- **Context:** A retry after a timeout must not duplicate an item.
- **Options:** Rely on UI disabling; deduplicate in memory; persist an actor/scope/key uniqueness constraint.
- **Selected:** Optional idempotency keys are fingerprinted and stored in the same transaction as item creation.
- **Trade-offs:** Keys are client supplied and records need an eventual retention policy.
- **Fit:** The database uniqueness constraint handles concurrent retries across API processes.

## 5. Cursor pagination

- **Context:** Lists may reach tens of thousands of items.
- **Options:** Offset pagination; unbounded queries; cursor pagination.
- **Selected:** Database query filters and cursor pagination use stable `createdAt desc, id desc` order with a 100-row cap.
- **Trade-offs:** Cursors are opaque record IDs and arbitrary page-number jumps are unsupported.
- **Fit:** Work grows with the requested page rather than a large offset; indexes mirror common filters.

## Defaults

- `RESOLVED -> IN_PROGRESS` is allowed to reopen a resolved item; reopening a closed item requires a new item.
- Team Admin is scoped to ordinary Member actions plus membership administration as a future extension; there is no global admin bypass.
- Demo users share a configurable local-only password set by `SEED_DEMO_PASSWORD`.
