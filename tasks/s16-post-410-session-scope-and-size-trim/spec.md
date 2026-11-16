# S16 — Post-`#410` Session Scope, Route Provider Cleanup & `<=500`L Size Trim

## Goal reference
- Blocked goals (pending `#410` merge): `goals/s16-post-410-session-scope-and-size-trim/goals.v0.md`
- Goal establishment record: `goals/s16-post-410-session-scope-and-size-trim/establish-goals.v0.md`
- Bounded context architecture: `specs/bounded-contexts-2026.md` (`customer-identity`, `class-checkout`, §2.4 & §6.2 size ceilings)

## Scope

### In scope
- `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx` and frontend customer session tests (`packages/frontend/tests/customer-registration-session.test.ts`, `packages/frontend/tests/customer-account.test.ts`, or dedicated context tests) — scope refresh effect to `activeOrgSlug` memo (`#385` + `#393`).
- `packages/frontend/src/app/AppRoutes.tsx` — remove unused `<ClassRegistrationProvider>` wrapper around membership `CustomerCheckoutRecoveryPage` (`/org/:slug/checkout-recovery/:token`).
- `packages/frontend/src/lib/api/registration.ts` (`510`L -> `<=500`L), `packages/backend/src/checkout/in-memory-class-checkout-execution-helpers.ts` (`503`L -> `<=500`L; `518`L on branch tip), and any files exceeding `500` lines introduced or grown by `#410` (plus directly extracted helper modules if required).
- `CHANGELOG.md` — update `## [0.4.0]` with `#410`, `S15`, and `S16` release notes ahead of `S14` `main -> release` cutover.
- `tasks/s16-post-410-session-scope-and-size-trim/spec.md` and `tasks/s16-post-410-session-scope-and-size-trim/code-review.md`.

### Out of scope
- Any code modification prior to Issue `#410` merging to `main` and `S16` transitioning from `State: blocked` to `State: locked`.
- `S15`-owned backend/CI hardening (`customer-session-repository.ts`, `customer-token-refresh.ts`, `customer-auth.routes.ts`, `tenant-organization-service.ts`, `.github/workflows/*.yml`, `refresh_locked_until` migration).
- `S14` release execution (`main -> release` merge, `v0.4.0` tag push, and `.github/workflows/deploy.yml` rollout).
- Functional behavior changes to `#410` checkout restoration beyond `<=500`L modular extraction.

## Approach
1. **Preflight Unblock Gate**:
   - Confirm Issue `#410` (and `S15`) are merged on `origin/main`.
   - Clear `## Blocking ambiguity` and update `- State: blocked` to `- State: locked` in `goals/s16-post-410-session-scope-and-size-trim/establish-goals.v0.md` and `goals/s16-post-410-session-scope-and-size-trim/goals.v0.md`; verify exit `0` via `validate-packet.ps1`.
2. **Scope `CustomerIdentityContext` Refresh Effect (`#385` + `#393`)**:
   - In `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx`, introduce an `activeOrgSlug` `createMemo` (`const r = shell.route(); return isOrganizationPageRoute(r) && "slug" in r ? r.slug : null;`) and key `createEffect(on(activeOrgSlug, ...))` on slug changes rather than `shell.route`.
   - Preserve validated `customerSession` and `csrfToken` across intra-organization SPA navigations (eliminating transient unauthenticated flashes and 5x–8x redundant `GET /customer-account/session` + `UPDATE shopify_customer_sessions` roundtrips) while still clearing and re-fetching on organization switches, navigating outside org routes, or explicit sign-out.
   - Add Red-Green frontend tests asserting zero redundant fetches during in-org route transitions and proper reset on org switch / sign-out / non-org route navigation.
3. **Clean Up `AppRoutes.tsx` Provider Wrapping**:
   - Remove the unused `<ClassRegistrationProvider>` wrapper around `<Pages.CustomerCheckoutRecoveryPage app={useFestivalShell()} />` on `/org/:slug/checkout-recovery/:token` in `packages/frontend/src/app/AppRoutes.tsx`.
4. **Restore `<=500`-Line Ceilings & Sync `CHANGELOG.md`**:
   - Scan all source files (including `#410` additions) for `>500`L violations; extract cohesive helpers to trim `packages/frontend/src/lib/api/registration.ts`, `packages/backend/src/checkout/in-memory-class-checkout-execution-helpers.ts`, and any `#410` crossings below `<=500`L (`<=250`L/class, `<=60`L/fn).
   - Update `CHANGELOG.md` `## [0.4.0]` with concise entries covering `#410`, `S15`, and `S16` so `S14` can promote `main -> release` cleanly.

## Verification commands
Execute natively in Windows PowerShell (`pwsh`):
```powershell
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s16-post-410-session-scope-and-size-trim
bun run verify:toolchain
bun run format:check
bun run lint
bun run build
bun run --cwd packages/frontend check:types
bunx --bun tsc -p packages/backend/tsconfig.json --noEmit
bun run check:sql
bun run test
```
Plus PostgreSQL 17 integration verification (`POSTGRES_INTEGRATION_URL` / `DATABASE_URL`) and `architecture-boundaries.test.ts` pass (`0` errors, `0` warnings).

## Delivery
Pending execution.

## Quality gate results
Pending execution.
