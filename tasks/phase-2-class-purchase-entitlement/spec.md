# Phase 2 class purchase entitlement issue organization

## Goal reference

- `goals/phase-2-class-purchase-entitlement/goals.v3.md` (locked)

## Scope

### In scope

- Preserve the supplied #141/#143 remaining-work research in a root Phase 2
  narrative.
- Reopen, re-scope, and comment only on #141 and #143, exactly as mapped by
  the locked goals.
- Preserve #137/#138 parentage and the closed prerequisite status of
  #140/#142/#149; create and close no issue.

### Out of scope

- Product/API/UI/database/Shopify implementation and tests.
- Phase 3 verified-payment capacity allocation, waitlist outcomes, and any
  broader issue reorganization.

## Approach

- Document the locked happy path before any issue mutation, then apply only the
  mapped #141/#143 status, title/body, and clarification-comment updates.

## Verification commands

- Lint: `git diff --check`
- Build: Not applicable; documentation and issue organization only.
- Tests: GitHub issue readback through the REST API after mutation.

## Delivery

- Delivered: Locked-goal artifacts, the root Phase 2 narrative, reopened and
  re-scoped #141 and #143, and one approved clarification comment on each.
- Exceptions: Initial GitHub CLI authentication failed inside the sandbox; the
  approved outside-sandbox token session completed the issue updates.
- Deferred work: Product implementation and Phase 3 allocation.
- Dirty-worktree decision: continue. The only pre-existing changes are this
  task's untracked goal/research artifacts and manifest update.

## Quality gate results

- Lint: passed (`git diff --check`)
- Build: not applicable
- Tests: passed; GitHub readback confirmed #141/#143 are open with the approved
  titles, scopes, and clarification comments.
- Code review: pending
- Clean merge: pending
