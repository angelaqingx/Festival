# Code Review
- Task name: auth-customer-identity
- Findings status: none

## Context
- Base branch: c867cb027d04c19852561f9c5a664461002bbc8a
- Diff command: `git diff --cached; git diff; inspect listed untracked files`
- Changed files:
  - `packages/backend/src/domains/customer-identity/index.ts`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts`
  - `packages/backend/tests/customer-account-routes.test.ts`
  - `packages/backend/tests/customer-account-service.test.ts`
  - `packages/backend/tests/customer-auth.routes.test.ts`
  - `tasks/auth-customer-identity/spec.md`
- Citation candidates (verify before use):
  - `packages/backend/src/domains/customer-identity/index.ts:13-13`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:1-1`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:126-132`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:152-152`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:155-155`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:159-159`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:3-3`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:65-96`
  - `packages/backend/src/routes/customer-auth/customer-auth.routes.ts:9-9`
  - `packages/backend/tests/customer-account-routes.test.ts:13-17`
  - `packages/backend/tests/customer-account-routes.test.ts:148-148`
  - `packages/backend/tests/customer-account-routes.test.ts:2-2`
  - `packages/backend/tests/customer-account-routes.test.ts:33-33`
  - `packages/backend/tests/customer-account-routes.test.ts:463-463`
  - `packages/backend/tests/customer-account-routes.test.ts:489-489`
  - `packages/backend/tests/customer-account-routes.test.ts:573-573`
  - `packages/backend/tests/customer-account-routes.test.ts:576-578`
  - `packages/backend/tests/customer-account-routes.test.ts:590-590`
  - `packages/backend/tests/customer-account-routes.test.ts:596-598`
  - `packages/backend/tests/customer-account-service.test.ts:20-20`
  - `packages/backend/tests/customer-account-service.test.ts:307-463`
  - `packages/backend/tests/customer-account-service.test.ts:7-7`
  - `packages/backend/tests/customer-auth.routes.test.ts:17-21`
  - `packages/backend/tests/customer-auth.routes.test.ts:2-2`
  - `packages/backend/tests/customer-auth.routes.test.ts:234-234`
  - `packages/backend/tests/customer-auth.routes.test.ts:244-244`
  - `packages/backend/tests/customer-auth.routes.test.ts:259-259`
  - `packages/backend/tests/customer-auth.routes.test.ts:270-270`
  - `packages/backend/tests/customer-auth.routes.test.ts:29-29`
  - `packages/backend/tests/customer-auth.routes.test.ts:302-302`
  - `packages/backend/tests/customer-auth.routes.test.ts:324-324`
  - `packages/backend/tests/customer-auth.routes.test.ts:330-332`
  - `packages/backend/tests/customer-auth.routes.test.ts:351-351`
  - `packages/backend/tests/customer-auth.routes.test.ts:406-406`
  - `packages/backend/tests/customer-auth.routes.test.ts:437-437`
  - `packages/backend/tests/customer-auth.routes.test.ts:440-442`
  - `packages/backend/tests/customer-auth.routes.test.ts:476-476`
  - `packages/backend/tests/customer-auth.routes.test.ts:479-481`

## Findings JSON
```json
[]
```

## Verdict
- Verdict: patch is correct
- Confidence: 0.96
- Justification: Unit #399 binds every callback and OAuth denial to its initiating browser using a short-lived per-state __Host cookie. The check runs before state consumption or token exchange, while state/nonce validation and one-time consumption remain in the service. Secure host-only cookie attributes prevent sibling-domain cookie injection, and separate cookie names preserve concurrent sign-ins. The reviewed production and test diff contains no actionable regression.


## Unit #399 validation evidence

- Independent targeted run passed 108 tests across customer-auth.routes, customer-account-service, customer-account-routes, customer-logout-csrf, and csrf-guard suites.
- Independent architecture-boundaries and route-security run passed 11 tests.
- Backend and test TypeScript check passed with `bunx --bun tsc -p packages/backend/tsconfig.json --noEmit`.
- Biome check passed for all five changed TypeScript files.
- `git diff --check` passed.
- Tests exercise wrong or absent browser binding before exchange, initiating-browser success, replay rejection, OAuth denial, concurrent sign-in completion in reverse order, secure cookie attributes, state expiry, and existing nonce/issuer/audience validation.
- No schema or session persistence contract changes are part of this unit.
- Commit and PR checks are pending coordinating-agent authorization and execution.
