# Code Review
- Task name: auth-checkout-boundaries
- Findings status: none

## Context
- Base branch: 222e3cee07564d5cc6891cd2bf1b5a88bd2e93f3
- Diff command: `git diff --cached; git diff; inspect listed untracked files`
- Changed files:
  - `packages/frontend/src/lib/api/registration.ts`
  - `packages/frontend/tests/api/api-clients.test.ts`
- Citation candidates (verify before use):
  - `packages/frontend/src/lib/api/registration.ts:110-127`
  - `packages/frontend/src/lib/api/registration.ts:129-129`
  - `packages/frontend/tests/api/api-clients.test.ts:201-324`

## Findings JSON
```json
[]
```

## Verdict
- Verdict: patch is correct
- Confidence: 0.97
- Justification: Unit #404 restores the pre-migration header precedence for supported checkout call forms. Explicit positional tokens and keys override embedded values, token/input/key retains its key across retries, and the current object-only caller keeps its body and headers. Comparison against c6a4029 and parameterized repeated-call tests show no actionable regression.


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
- Independently reviewed with no findings. Commit and push are authorized after these checks.
