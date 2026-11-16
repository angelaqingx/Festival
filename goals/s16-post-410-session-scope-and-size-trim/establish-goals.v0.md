# Establish Goals
- Task name: s16-post-410-session-scope-and-size-trim
- Iteration: v0
- State: blocked

## Status
Blocked pending PR `#413` merge to `main`. Packet stays `blocked` until PR `#413` lands on `origin/main` (Issue `#410` remains open afterwards for live partial-payment acceptance), then transitions to `locked` before implementation begins.

## Request
After PR `#413` merges to `main`, update both the `createEffect` trigger and `isCurrentRequest()` freshness guard in `CustomerIdentityContext.tsx` to track an `activeOrgSlug` memo while preserving PR `#413`'s `refreshOnReturn` focus/pageshow check without flashing `customerSession` to `unauthenticated` (`#385` + `#393` + eliminating `#413`'s per-click live Shopify GraphQL calls), remove the unused `<ClassRegistrationProvider>` wrapper around membership `CustomerCheckoutRecoveryPage` in `AppRoutes.tsx`, update `CHANGELOG.md` `## [0.4.0]` with `#412`, `#413`, `S15`, and `S16` entries, and pass full pre-cutover verification under the `500`L-new / `2,000`L-existing file-size ratchet policy (with zero forced splits of grandfathered files).

## Blocking ambiguity
Blocked until open PR #413 (implementing Issue #410 Shopify checkout restoration and can_read_orders / OAuth login-readiness decoupling) merges to main; Issue #410 itself stays open for live partial-payment acceptance testing.

## Assumptions
- `S15` (`s15-backend-pool-cache-and-ci-hardening`), PR `#412` (`#336`), and PR `#413` (`#410`) will merge to `origin/main` before `S16` transitions from `blocked` to `locked`.
- Under the tiered file-size ratchet established in `S15`, existing non-domain `.ts`/`.tsx` files (`registration.ts`, `customer-class-checkout.routes.ts`, `CustomerAccountOrdersPage.tsx`, `in-memory-class-checkout-execution-helpers.ts`) are grandfathered at `<= 2,000` lines and do not require forced pre-release splits.
- `S14` (`main` to `release` cutover, `v0.4.0` tag, and production rollout) waits until `S16` finishes and leaves `main` green.

## Goals
1. Update both the `createEffect` trigger and the `isCurrentRequest()` freshness guard in `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx` to use an `activeOrgSlug` memo (`!disposed && request === latestRequest && activeOrgSlug() === targetSlug`), preserve PR `#413`'s `refreshOnReturn` focus/pageshow check without flashing `customerSession` to `unauthenticated` on same-org return (eliminating `#413`'s per-click live Shopify Storefront/Admin GraphQL calls), and add a delayed-response intra-org navigation test (`#385` + `#393`).
2. Remove the unused `<ClassRegistrationProvider>` wrapper around membership `CustomerCheckoutRecoveryPage` (`/org/:slug/checkout-recovery/:token`) in `packages/frontend/src/app/AppRoutes.tsx`, and update `CHANGELOG.md` `## [0.4.0]` with `#412`, `#413`, `S15`, and `S16` entries ahead of `S14` `main` to `release` promotion.
3. Pass full toolchain, lint, format, frontend/backend `tsc`, `check:sql`, `architecture-boundaries.test.ts`, `file-size-ratchet.test.ts`, and PostgreSQL 17 integration suites under the `500`L-new / `2,000`L-existing file-size policy, with zero forced splits of grandfathered files (`registration.ts`, `customer-class-checkout.routes.ts`, `CustomerAccountOrdersPage.tsx`, `in-memory-class-checkout-execution-helpers.ts`).

## Non-goals
- Editing any file before PR `#413` merges to `main` and `S16` is explicitly unlocked (`State: locked`).
- Splitting grandfathered non-domain files under the `2,000`-line baseline (`registration.ts`, `customer-class-checkout.routes.ts`, `CustomerAccountOrdersPage.tsx`, `in-memory-class-checkout-execution-helpers.ts`).
- Altering `#410` checkout restoration semantics or executing live partial-payment acceptance testing for Issue `#410`.
- Executing `S14` `main` to `release` merge, `v0.4.0` git tagging, or live production deployment (`deploy.yml`) inside `S16`.

## Success criteria
- [G1] Both `createEffect` and `isCurrentRequest()` in `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx` use the `activeOrgSlug` memo (`!disposed && request === latestRequest && activeOrgSlug() === targetSlug`); PR `#413`'s `refreshOnReturn` focus/pageshow behavior is preserved without flashing `customerSession` to `unauthenticated` on same-org return or triggering per-click Shopify Storefront/Admin GraphQL calls; and frontend tests (including a delayed-response intra-org navigation test) pass while still resetting cleanly on org switches, leaving org routes, and sign-out.
- [G2] `packages/frontend/src/app/AppRoutes.tsx` renders `CustomerCheckoutRecoveryPage` on `/org/:slug/checkout-recovery/:token` without `<ClassRegistrationProvider>`, and `CHANGELOG.md` `## [0.4.0]` includes `#412`, `#413`, `S15`, and `S16` entries ahead of `S14` `main` to `release` promotion.
- [G3] Full verification (`verify:toolchain`, `format:check`, `lint`, `build`, frontend/backend `tsc --noEmit`, `check:sql`, `architecture-boundaries.test.ts`, `file-size-ratchet.test.ts`, and Postgres 17 integration suites via `bun run test`) passes with `0` errors and `0` warnings under the `500`L-new / `2,000`L-existing policy without forced splits of grandfathered files.

## Next action
Wait for PR `#413` to merge to `main`, flip `- State: blocked` to `- State: locked` in `goals/s16-post-410-session-scope-and-size-trim/{establish-goals,goals}.v0.md` after clearing `## Blocking ambiguity`, re-run `validate-packet.ps1`, and execute `tasks/s16-post-410-session-scope-and-size-trim/spec.md` on an isolated branch off updated `origin/main`.
