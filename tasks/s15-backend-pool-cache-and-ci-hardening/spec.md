# S15 — Backend Pool Lease, OAuth Cookie Scoping, Cache Wiring & CI Hardening

## Goal reference
- Locked goals: `goals/s15-backend-pool-cache-and-ci-hardening/goals.v0.md`
- Goal establishment record: `goals/s15-backend-pool-cache-and-ci-hardening/establish-goals.v0.md`
- Bounded context architecture: `specs/bounded-contexts-2026.md` (`customer-identity`, `tenant-org`, §5 Rule 4)

## Scope

### In scope
- `database/migrations/` (new tracked SQL migration adding `refresh_locked_until TIMESTAMPTZ` to `orgs.shopify_customer_sessions`), `database/postgres17-schema.sql`, and `packages/backend/src/repo/postgres-schema.ts` — lockstep schema definition and parity compliance.
- `packages/backend/src/domains/customer-identity/customer-session-repository.ts`, `packages/backend/src/domains/customer-identity/customer-token-refresh.ts`, and `packages/backend/src/domains/customer-identity/{types,mappers}.ts` — replace `sql.reserve()` + `pg_try_advisory_lock` refresh locking with a non-blocking short-lived `refresh_locked_until` DB lease while preserving `encrypted_tokens` CAS (`replaceSessionTokens` / `revokeSession`).
- `packages/backend/src/routes/customer-auth/customer-auth.routes.ts` (plus `packages/backend/src/routes/route-groups.ts`, `packages/backend/src/routes/route-group-options.ts`, and `packages/backend/src/composition/runtime.ts` solely to thread `publicOrigin` if required) — scope OAuth browser-binding cookie to `Path=/api/customer-auth` (dropping `__Host-` `Path=/`) and set `Secure: true` strictly for `https:` `publicOrigin` (`Secure: false` only for explicit local HTTP loopback origins `http://localhost:8080` / `http://127.0.0.1:8080`).
- `packages/backend/src/domains/tenant-org/tenant-organization-service.ts` (and `packages/backend/src/services/organization-service.ts` / `packages/backend/src/composition/runtime.ts` if needed for invalidator wiring) — subscribe `publicOrganizationListCache` (`4`h TTL) to `DomainCacheInvalidator` (`OrgUpdated`, `CachesCleared` / `clearAll`) and emit `OrgUpdated` on tenant creation/mutations.
- `.github/workflows/pr-checks.yml` and `.github/workflows/integration.yml` — add `push: branches: [main]` CI verification and align `integration.yml` with `postgres:17-alpine`, `POSTGRES_INTEGRATION_URL`, and pre-startup `bun run scripts/migrate.ts`.
- Targeted tests: `packages/backend/tests/customer-auth.routes.test.ts`, `packages/backend/tests/domains/tenant-org/tenant-org.test.ts`, and Postgres 17 customer refresh concurrency integration coverage in `packages/backend/tests/postgres-customer-account-repository.integration.test.ts` (or `packages/backend/tests/domains/customer-identity/`).
- Packet delivery/review tracking: `tasks/s15-backend-pool-cache-and-ci-hardening/spec.md` and `tasks/s15-backend-pool-cache-and-ci-hardening/code-review.md`.

### Out of scope
- `#410`-active paths (strictly locked):
  - `packages/backend/src/domains/class-checkout/**`
  - `packages/backend/src/domains/commerce-projection/**`
  - `packages/frontend/src/lib/registrationCartState.ts`
  - `packages/frontend/src/domains/registration/**`
  - `packages/frontend/src/components/AppHeader.tsx`
  - `packages/frontend/src/domains/customer/CustomerIdentityContext.tsx`
  - `nginx/*.conf` and `docker/nginx.festival.conf`
  - `specs/pending-shopify-checkout-restoration.md`
- `S16`-scoped files (`packages/frontend/src/app/AppRoutes.tsx`, `packages/frontend/src/lib/api/registration.ts`, `packages/backend/src/checkout/in-memory-class-checkout-execution-helpers.ts`, `CHANGELOG.md`).
- Unrelated `packages/frontend/**`, `packages/common/**`, `packages/shopify-confirmation/**`, `goals/**`, and other `tasks/**` directories.

## Approach
1. **Non-Blocking DB Lease for Customer Token Refresh (`#407`)**:
   - Add `refresh_locked_until TIMESTAMPTZ` (nullable) to `orgs.shopify_customer_sessions` across a new `database/migrations/` SQL file, `database/postgres17-schema.sql`, and `packages/backend/src/repo/postgres-schema.ts`.
   - Replace `await sql.reserve()` + `pg_try_advisory_lock` in `PostgresCustomerSessionRepository.withSessionRefreshLock` with fast single-statement lease claim (`UPDATE ... SET refresh_locked_until = $2 WHERE session_id = $1 AND (refresh_locked_until IS NULL OR refresh_locked_until <= $3)`), bounded polling/backoff when another worker holds the active lease, and explicit lease release in `finally` — ensuring no pooled connection is held across the up to 4 external Shopify HTTPS requests (`discover`, `exchangeOAuthTokens`, `verifyCustomerIdToken`, up to `10_000`ms each against `DB_POOL_MAX = 80`) in `refreshLockedSession`.
   - Keep `replaceSessionTokens` / `revokeSession` `encrypted_tokens` CAS checks intact so lease-expiration races remain linearizable and safe.
   - Add a deterministic Postgres 17 integration test driving `>= 80` concurrent session refreshes with slow simulated upstream calls, proving `DB_POOL_MAX` is never exhausted and concurrent unrelated queries complete promptly.
2. **OAuth Browser-Binding Cookie Scoping & Loopback Support (`#399` / `#407`)**:
   - In `packages/backend/src/routes/customer-auth/customer-auth.routes.ts`, scope the per-transaction OAuth binding cookie to `Path=/api/customer-auth` and drop the `__Host-` prefix + `Path=/` so abandoned starts never transmit ~145-byte cookies on page or static asset requests.
   - Derive `secure` strictly from `publicOrigin`: `true` when `publicOrigin` starts with `https:`, `false` solely when `publicOrigin` matches an explicit local HTTP loopback origin (`http://localhost:8080` or `http://127.0.0.1:8080`). Update and expand `packages/backend/tests/customer-auth.routes.test.ts` for both HTTPS and local loopback origins and cookie clearing on callback.
3. **`TenantOrganizationService` Cache Invalidation Wiring (`#383`)**:
   - In `packages/backend/src/domains/tenant-org/tenant-organization-service.ts`, update `bindCacheInvalidator` to unsubscribe any prior listener and subscribe to `DomainCacheInvalidator` (`OrgUpdated` and `CachesCleared` / `clearAll`) so `publicOrganizationListCache` (`4`h TTL) is evicted immediately per `specs/bounded-contexts-2026.md` §5 Rule 4.
   - Confirm tenant creation and organization mutations emit `OrgUpdated` and verify immediate cache eviction on `OrgUpdated` and `clearAll()` in `packages/backend/tests/domains/tenant-org/tenant-org.test.ts`.
4. **CI Workflow Hardening**:
   - Update `.github/workflows/pr-checks.yml` to trigger on `push: branches: [main]` as well as `pull_request`.
   - Update `.github/workflows/integration.yml` to run a `postgres:17-alpine` service container with `POSTGRES_INTEGRATION_URL` during `verify` and execute `bun run scripts/migrate.ts` prior to application startup in `deploy-integration`.

## Verification commands
Execute natively in Windows PowerShell (`pwsh`):
```powershell
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s15-backend-pool-cache-and-ci-hardening
bun run verify:toolchain
bun run format:check
bun run lint
bun run build
bun run --cwd packages/frontend check:types
bunx --bun tsc -p packages/backend/tsconfig.json --noEmit
bun run check:sql
bun run test
```
Plus Linux/Docker PostgreSQL 17 integration & schema parity verification (`DATABASE_URL` / `POSTGRES_INTEGRATION_URL`, `bun run check:schema-parity`).

## Delivery
Pending execution.

## Quality gate results
Pending execution.
