# Establish Goals
- Task name: s16-post-410-session-scope-and-size-trim
- Iteration: v0
- State: blocked

## Status
Blocked pending Issue `#410` merge to `main`. Packet must remain `blocked` until `#410` lands on `origin/main`, then transition to `locked` before any implementation edits begin.

## Request
After Issue `#410` merges to `main`, scope `CustomerIdentityContext` session refresh to active organization slug changes (`#385` + `#393`), remove unused `<ClassRegistrationProvider>` wrapping around `CustomerCheckoutRecoveryPage` in `AppRoutes.tsx`, restore `<=500`-line file ceilings on post-`S14` crossings (`registration.ts`, `in-memory-class-checkout-execution-helpers.ts`, and any `#410` crossings), synchronize `CHANGELOG.md` `## [0.4.0]` with `#410`, `S15`, and `S16`, and pass full verification to unblock `S14` `v0.4.0` release cutover.

## Blocking ambiguity
Blocked until active local work for Issue #410 (specs/pending-shopify-checkout-restoration.md and pending PR touching class-checkout, commerce-projection, AppHeader, registration state, and nginx) merges to main.

## Assumptions
- `S15` (`s15-backend-pool-cache-and-ci-hardening`) and Issue `#410` will merge to `origin/main` before `S16` transitions from `blocked` to `locked`.
- `S14` (`main -> release` cutover, `v0.4.0` tag, and production rollout) remains paused until `S16` completes and leaves `main` green and compliant with `<=500`L file ceilings.

## Goals
1. Scope `CustomerIdentityContext` session refresh effect in `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx` (`#385` + `#393` regression) by replacing `on(shell.route, ...)` with an `activeOrgSlug` memo (`isOrganizationPageRoute(r) && "slug" in r ? r.slug : null`) so in-org SPA navigations keep validated `customerSession` and `csrfToken` without transient unauthenticated flashes or 5x–8x redundant `GET /customer-account/session` + `UPDATE shopify_customer_sessions` roundtrips, while still resetting on org switches, leaving org routes, or explicit sign-out.
2. Remove the unused `<ClassRegistrationProvider>` wrapper around membership `CustomerCheckoutRecoveryPage` (`/org/:slug/checkout-recovery/:token`) in `packages/frontend/src/app/AppRoutes.tsx`.
3. Restore `<=500`-line ceilings on post-`S14` crossings—specifically `packages/frontend/src/lib/api/registration.ts` (`510`L -> `<=500`L), `packages/backend/src/checkout/in-memory-class-checkout-execution-helpers.ts` (`503`L -> `<=500`L; `518`L on branch tip), and any `>500`L crossings introduced by `#410`—and synchronize `CHANGELOG.md` `## [0.4.0]` with `#410`, `S15`, and `S16` notes ahead of `S14` `main -> release` cutover.
4. Pass full deterministic workspace verification (`verify:toolchain`, `format:check`, `lint`, `build`, frontend/backend `tsc`, `check:sql`, `architecture-boundaries.test.ts`, and PostgreSQL 17 integration tests with `0` errors and `0` warnings) to unblock `S14` `v0.4.0` release promotion.

## Non-goals
- Editing any file before `#410` merges to `main` and `S16` is explicitly unlocked (`State: locked`).
- Modifying `#410` checkout restoration semantics beyond trimming any post-merge `>500`L file size violations cleanly.
- Executing `S14` `main -> release` merge, `v0.4.0` git tagging, or live production deployment (`deploy.yml`) inside `S16`.

## Success criteria
- [G1] `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx` tracks an `activeOrgSlug` memo (`isOrganizationPageRoute(r) && "slug" in r ? r.slug : null`) instead of `on(shell.route, ...)`; frontend session tests verify in-org SPA navigations retain `customerSession` and `csrfToken` with zero redundant `GET /customer-account/session` calls while resetting cleanly on org switches, leaving org routes, and sign-out.
- [G2] `packages/frontend/src/app/AppRoutes.tsx` renders `CustomerCheckoutRecoveryPage` on `/org/:slug/checkout-recovery/:token` without an unused `<ClassRegistrationProvider>` wrapper.
- [G3] `packages/frontend/src/lib/api/registration.ts`, `packages/backend/src/checkout/in-memory-class-checkout-execution-helpers.ts`, and all files touched or introduced by `#410` comply with `<=500`L/file (`<=250`L/class, `<=60`L/fn), and `CHANGELOG.md` `## [0.4.0]` includes `#410`, `S15`, and `S16` summaries.
- [G4] Full verification (`verify:toolchain`, `format:check`, `lint`, `build`, frontend/backend `tsc --noEmit`, `check:sql`, `architecture-boundaries.test.ts`, and Postgres 17 `bun run test`) passes with `0` errors and `0` warnings, unblocking `S14` cutover.

## Next action
Wait for Issue `#410` to merge to `main`, flip `- State: blocked` to `- State: locked` in `goals/s16-post-410-session-scope-and-size-trim/{establish-goals,goals}.v0.md` after clearing `## Blocking ambiguity`, re-run `validate-packet.ps1`, and execute `tasks/s16-post-410-session-scope-and-size-trim/spec.md` on an isolated branch off updated `origin/main`.
