# Issue #157: reset-only PostgreSQL target schema

## Goal reference

- `goals/issue-157-sql-migrations/goals.v1.md` (locked)

## Scope

### In scope

- #158–#163: PostgreSQL 17/database configuration, one canonical schema initializer, shared repository startup path, schema contract coverage/snapshot, code/documentation for clean-slate onboarding, and the 0.2.0 release metadata.
- One commit after each completed sub-issue.
- Pull request from `codex/issue-157-sql-migrations` to `ericp/exp-long-running-agent`, with a manual Admin Tool Shopify Integration Run marked as required before merge.

### Out of scope

- Live Admin Tool, Firebase, Shopify, or webhook operations.
- Data preservation, migration, backfill, or database reset logic.
- Independently actionable issues #153, #155, and #156.

## Approach

- Extract each current repository migration into a dependency-ordered schema definition; then make repositories delegate readiness to it. Validate the contract against an empty PostgreSQL 17 environment and retain the external Admin Tool run as a documented manual gate.

## Verification commands

- Lint: `bun run format:check`
- Build: `bun run build`
- Tests: `bun run test`

## Delivery

- Delivered: pending
- Exceptions: None
- Deferred work: None
- Dirty-worktree decision: continue — the only preflight entries are task-owned locked-goal artifacts and this task spec.

## Quality gate results

- Lint: pending
- Build: pending
- Tests: pending
- Code review: pending
- Clean merge: pending
