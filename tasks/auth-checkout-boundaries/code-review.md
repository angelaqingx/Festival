# Code Review
- Task name: auth-checkout-boundaries
- Findings status: none

## Context
- Base branch: c867cb027d04c19852561f9c5a664461002bbc8a
- Diff command: `git diff --cached; git diff; inspect listed untracked files`
- Changed files:
  - `packages/backend/src/routes/customer/customer-registration.routes.ts`
  - `packages/backend/tests/drop-transfer-routes.test.ts`
  - `packages/frontend/src/lib/api/registration.ts`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx`
  - `packages/frontend/tests/drop-transfer.test.ts`
  - `tasks/auth-checkout-boundaries/spec.md`
- Citation candidates (verify before use):
  - `packages/backend/src/routes/customer/customer-registration.routes.ts:166-166`
  - `packages/backend/src/routes/customer/customer-registration.routes.ts:168-170`
  - `packages/backend/tests/drop-transfer-routes.test.ts:1-1`
  - `packages/backend/tests/drop-transfer-routes.test.ts:1019-1019`
  - `packages/backend/tests/drop-transfer-routes.test.ts:1038-1042`
  - `packages/backend/tests/drop-transfer-routes.test.ts:105-134`
  - `packages/backend/tests/drop-transfer-routes.test.ts:1064-1064`
  - `packages/backend/tests/drop-transfer-routes.test.ts:1083-1087`
  - `packages/backend/tests/drop-transfer-routes.test.ts:11-11`
  - `packages/backend/tests/drop-transfer-routes.test.ts:185-185`
  - `packages/backend/tests/drop-transfer-routes.test.ts:19-22`
  - `packages/backend/tests/drop-transfer-routes.test.ts:219-288`
  - `packages/backend/tests/drop-transfer-routes.test.ts:338-342`
  - `packages/backend/tests/drop-transfer-routes.test.ts:356-360`
  - `packages/backend/tests/drop-transfer-routes.test.ts:376-380`
  - `packages/backend/tests/drop-transfer-routes.test.ts:390-390`
  - `packages/backend/tests/drop-transfer-routes.test.ts:397-401`
  - `packages/backend/tests/drop-transfer-routes.test.ts:40-40`
  - `packages/backend/tests/drop-transfer-routes.test.ts:411-411`
  - `packages/backend/tests/drop-transfer-routes.test.ts:417-421`
  - `packages/backend/tests/drop-transfer-routes.test.ts:442-442`
  - `packages/backend/tests/drop-transfer-routes.test.ts:450-450`
  - `packages/backend/tests/drop-transfer-routes.test.ts:468-469`
  - `packages/backend/tests/drop-transfer-routes.test.ts:507-508`
  - `packages/backend/tests/drop-transfer-routes.test.ts:521-521`
  - `packages/backend/tests/drop-transfer-routes.test.ts:529-530`
  - `packages/backend/tests/drop-transfer-routes.test.ts:543-543`
  - `packages/backend/tests/drop-transfer-routes.test.ts:552-553`
  - `packages/backend/tests/drop-transfer-routes.test.ts:566-566`
  - `packages/backend/tests/drop-transfer-routes.test.ts:575-576`
  - `packages/backend/tests/drop-transfer-routes.test.ts:612-612`
  - `packages/backend/tests/drop-transfer-routes.test.ts:619-619`
  - `packages/backend/tests/drop-transfer-routes.test.ts:630-631`
  - `packages/backend/tests/drop-transfer-routes.test.ts:701-701`
  - `packages/backend/tests/drop-transfer-routes.test.ts:747-747`
  - `packages/backend/tests/drop-transfer-routes.test.ts:783-783`
  - `packages/backend/tests/drop-transfer-routes.test.ts:825-825`
  - `packages/backend/tests/drop-transfer-routes.test.ts:844-844`
  - `packages/backend/tests/drop-transfer-routes.test.ts:897-897`
  - `packages/backend/tests/drop-transfer-routes.test.ts:9-9`
  - `packages/backend/tests/drop-transfer-routes.test.ts:917-917`
  - `packages/backend/tests/drop-transfer-routes.test.ts:983-983`
  - `packages/backend/tests/drop-transfer-routes.test.ts:993-997`
  - `packages/frontend/src/lib/api/registration.ts:355-356`
  - `packages/frontend/src/lib/api/registration.ts:359-359`
  - `packages/frontend/src/lib/api/registration.ts:370-370`
  - `packages/frontend/src/lib/api/registration.ts:373-374`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:201-205`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:211-220`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:233-233`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:240-245`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:483-483`
  - `packages/frontend/src/pages/CustomerAccountOrdersPage.tsx:505-509`
  - `packages/frontend/tests/drop-transfer.test.ts:130-135`
  - `packages/frontend/tests/drop-transfer.test.ts:142-145`
  - `packages/frontend/tests/drop-transfer.test.ts:175-180`
  - `packages/frontend/tests/drop-transfer.test.ts:187-190`

## Findings JSON
```json
[]
```

## Verdict
- Verdict: patch is correct
- Confidence: 0.97
- Justification: Unit #400 uses the existing customer session CSRF and exact-origin check before entitlement access and either mutation. The browser passes the authenticated account session token through both supported API calls. Actual session fixtures cover denial before registration, audit, promotion, or refund effects while retaining valid ownership-scoped operations. The reviewed production and test diff contains no actionable regression.


## Unit #400 validation evidence

- Independent targeted run passed 95 backend tests across drop-transfer-routes, drop-transfer-service, and csrf-guard suites.
- Independent targeted frontend run passed 35 tests across drop-transfer, drop-transfer-ui-gating, and customer-account suites.
- Backend/test TypeScript and frontend `check:types` passed. The first sandboxed attempts could not write ignored incremental cache files, and both checks passed when rerun with the authorized worktree write permission.
- Biome check passed for all five changed TypeScript files.
- `git diff --check` passed.
- Tests exercise both endpoints with missing, empty, incorrect tokens and absent, opaque, malformed, or different origins. Denials preserve registrations and change logs, avoid promotion, and never call mutation or refund methods. Existing valid operations and cross-customer ownership denial remain covered.
- Client tests assert the CSRF header and cookie credentials without adding a Firebase Authorization header.
- Commit and PR checks are pending coordinating-agent authorization and execution.
