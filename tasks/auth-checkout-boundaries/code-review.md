# Code Review
- Task name: auth-checkout-boundaries
- Findings status: none

## Context
- Base branch: e2e5282f87076840f47c3f319001d465c7173471
- Diff command: `git diff --cached; git diff; inspect listed untracked files`
- Changed files:
  - `packages/frontend/src/domains/registration/registrationPageActions.ts`
  - `packages/frontend/src/domains/registration/useFestivalRegistrationPage.ts`
  - `packages/frontend/tests/checkout-auth-rejection.test.ts`
- Citation candidates (verify before use):
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:157-157`
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:284-286`
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:290-290`
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:299-300`
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:303-303`
  - `packages/frontend/src/domains/registration/registrationPageActions.ts:314-331`
  - `packages/frontend/src/domains/registration/useFestivalRegistrationPage.ts:351-351`

## Findings JSON
```json
[]
```

## Verdict
- Verdict: patch is correct
- Confidence: 0.96
- Justification: Unit #398 releases only a newly created submission after an auth rejection without earlier submission or recovery evidence, then refreshes customer identity without automatically resubmitting. Same-session refresh retains the editable draft, replacement sessions clear protected selections through the existing identity boundary, and disposed or superseded work is ignored. Existing uncertain submissions and recovery stay locked. No actionable regression was found.


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
- Independently reviewed with no findings. Commit and push are authorized after these checks.
