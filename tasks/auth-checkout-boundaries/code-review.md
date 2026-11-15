# Code Review
- Task name: auth-checkout-boundaries
- Findings status: none

## Context
- Base branch: 23eca3a11bb7183c3ee52e5871756afd3cae45c0
- Diff command: `git diff --cached; git diff; inspect listed untracked files`
- Changed files:
  - `packages/backend/src/routes/admin-class-checkout-recovery.routes.ts`
  - `packages/backend/tests/admin-class-checkout-recovery.test.ts`
- Citation candidates (verify before use):
  - `packages/backend/src/routes/admin-class-checkout-recovery.routes.ts:161-161`
  - `packages/backend/src/routes/admin-class-checkout-recovery.routes.ts:172-172`
  - `packages/backend/src/routes/admin-class-checkout-recovery.routes.ts:62-72`
  - `packages/backend/tests/admin-class-checkout-recovery.test.ts:87-151`

## Findings JSON
```json
[]
```

## Verdict
- Verdict: patch is correct
- Confidence: 0.97
- Justification: Unit #405 canonicalizes an explicitly valid HTTP or HTTPS configured origin once when constructing the admin recovery routes. The authority-only input check rejects userinfo, path, query, fragment, backslash, opaque, malformed, and missing configuration. Existing request-origin validation and required custom header remain intact for both reap and resolve. Equivalent host casing and default ports are covered without weakening cross-origin denial. No actionable regression was found.


## Unit #400 validation evidence

- Independent targeted run passed 95 backend tests across drop-transfer-routes, drop-transfer-service, and csrf-guard suites.
- Independent targeted frontend run passed 35 tests across drop-transfer, drop-transfer-ui-gating, and customer-account suites.
- Backend/test TypeScript and frontend `check:types` passed. The first sandboxed attempts could not write ignored incremental cache files, and both checks passed when rerun with the authorized worktree write permission.
- Biome check passed for all five changed TypeScript files.
- `git diff --check` passed.
- Tests exercise both endpoints with missing, empty, incorrect tokens and absent, opaque, malformed, or different origins. Denials preserve registrations and change logs, avoid promotion, and never call mutation or refund methods. Existing valid operations and cross-customer ownership denial remain covered.
- Client tests assert the CSRF header and cookie credentials without adding a Firebase Authorization header.
- Independently reviewed unit committed and pushed as `222e3cee07564d5cc6891cd2bf1b5a88bd2e93f3`. The coordinating agent also reported a successful full build and full test run using the isolated PostgreSQL 17 database, with log `/private/tmp/festival-auth-b1-validation.log`.


## Unit #404 validation evidence

- Independent run passed 51 tests across api/api-clients, festival-class-registration, and multiLineCheckoutHandoff suites.
- Frontend `check:types` passed.
- Biome check passed for both changed TypeScript files, and `git diff --check` passed.
- Reviewed supported call forms against `c6a4029c0185ead366d747942c8b2bffb2c00b7e`, including positional overrides, token/input/key, token/key/input, current object-only calls, omitted positional keys, and empty overrides.
- Repeated calls retain explicit keys and strip embedded header fields from the JSON body. Existing items-to-lineItems normalization coverage remains in place.
- Independently reviewed with no findings and committed/pushed as `e2e5282f87076840f47c3f319001d465c7173471`.


## Unit #398 validation evidence

- Independent targeted run passed 38 frontend tests across checkout-auth-rejection, class-checkout-hook, multiLineCheckoutHandoff, customer-registration-session, and parent-registration-state suites. Run these from `packages/frontend` so Bun applies the package JSX configuration. An initial root-directory invocation failed to load the TSX runtime; the corrected package-directory invocation passed.
- Frontend `check:types` passed.
- Biome check passed for both changed source files and the new test file, and `git diff --check` passed.
- Reviewed fresh 401/403 rejection, repeated retry, same-session draft retention, replacement-session clearing, delayed eligibility and disposal guards, no automatic checkout retry, existing uncertain submissions, retryable recovery, response recovery evidence, and rejected recovery-status requests.
- Independently reviewed with no findings and committed/pushed as `ee9275a7d6a7d661abf7b55a04311b3e5ebded44`.


## Units #402 and #406 validation evidence

- Independent backend run passed 37 tests across admin-entitlements-ops, customer-checkout-recovery, and checkout-recovery-service suites.
- Independent frontend run passed 38 tests across admin-entitlement-ops-panel, checkout-recovery-ui, and api/api-clients suites.
- Backend/test TypeScript and frontend `check:types` passed. Biome passed for all six changed TypeScript files, and `git diff --check` passed.
- Admin tests cover realistic-length bearer tokens, missing/overlong CSRF denial, separate bounded CSRF success, and all six shared client helper consumers.
- Customer tests use actual encrypted customer sessions, deny missing/empty/wrong/other-session tokens and invalid origins or recovery ownership before mutation, preserve source/recovery/audit state and zero Storefront calls, and cover valid resume plus consumed-link replay.
- Independently reviewed with no findings and committed/pushed as `23eca3a11bb7183c3ee52e5871756afd3cae45c0`.


## Unit #405 validation evidence

- Independent backend run passed 92 tests across admin-class-checkout-recovery, csrf-guard, nginx-security, and customer-logout-csrf suites.
- Backend/test TypeScript, Biome for both changed files, and `git diff --check` passed.
- Reviewed HTTP/HTTPS authority parsing, case normalization, default and explicit non-default ports, optional root slash, and rejection of path/userinfo/query/fragment/opaque/malformed/absent configuration. Both reap and resolve retain nonempty CSRF and exact request-origin checks.
- Independently reviewed with no findings. Commit and push are authorized after these checks.
