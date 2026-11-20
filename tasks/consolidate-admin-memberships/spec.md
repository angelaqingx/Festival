# Consolidate Admin Memberships

## Goal reference

[Locked goals](../../goals/consolidate-admin-memberships/goals.v0.md)

## Scope

The memberships route, its Entitlements table, and the private admin report projection. The report resolves active profiles by organization, customer ID, and membership role, then applies effective teacher divisions before filtering and paging. Existing admin endpoints handle updates and revocation.

The working tree already contained edits to `AGENTS.md` and `bun.lock`. The implementation used the current checkout and preserved those edits.

## Verification

- `bun run format:check`
- `bun run build`
- `bun run --cwd packages/frontend check:types`
- `bun run test`

The build, formatting, frontend and backend type checks, and test suite passed. The test run recorded 2,757 passes and 159 skips.
