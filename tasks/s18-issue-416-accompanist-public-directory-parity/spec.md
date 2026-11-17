# S18 — Issue `#416`: `$0` Accompanist Form Cleanup & Public Directory Parity with `#361`

## Goal reference
- Locked goals: `goals/s18-issue-416-accompanist-public-directory-parity/goals.v0.md`
- Goal establishment record: `goals/s18-issue-416-accompanist-public-directory-parity/establish-goals.v0.md`
- Master program ledger: `specs/pre-thanksgiving-program.md` (Wave 4D, depends strictly on `S17` `DONE` on `origin/main`; final feature packet before `S14` `v0.4.0` cutover)
- Bounded context architecture: `specs/bounded-contexts-2026.md` (`teacher-directory` bounded context: `orgs.accompanist_profiles`, `orgs.accompanist_profile_divisions`, `orgs.membership_entitlements`)

## Scope

### In scope
- Shared contracts (`@festival/common`):
  - `packages/common/src/commerce.ts` — remove `staffAccessConsent` from `AcquireAccompanistMembershipPayloadSchema` and `AcquireAccompanistMembershipRouteBodySchema` (leaving `CustomerMembershipCheckoutPayloadSchema` and `MembershipCheckoutIntentRecordSchema` untouched).
  - `packages/common/src/directory.ts` (if `UpdateAdminAccompanistProfileApprovalInput` / `UpsertCustomerAccompanistProfileInput` type aliases or schemas are added alongside teacher equivalents).
- Backend (`teacher-directory` & customer/profile routes, `<= 500` lines/file):
  - `packages/backend/src/domains/teacher-directory/membership-entitlement-helpers.ts` — remove `"staffAccessConsent"` from `ALLOWED_ACCOMPANIST_FIELDS` and remove the `payload.staffAccessConsent !== true` check in `parseAccompanistAcquirePayload`.
  - `packages/backend/src/routes/customer/customer-membership.routes.ts` — remove `"staffAccessConsent"` from `ACCOMPANIST_ALLOWED_FIELDS` and remove `recordCheckoutStaffAccessConsent` from `postAccompanistMembershipHandler` while keeping `resolveAccompanistContext` (`CUSTOMER_SESSION_COOKIE` + `X-CSRF-Token` + `resolveRequestOrigin` via `formAccess`).
  - `packages/backend/src/repo/profile-moderation.ts` and `packages/backend/src/infra/s10-infra.ts` — share auto-approval + sticky Admin `'rejected'` resolution (`resolveTeacherProfileApprovalStatus` / `resolveParticipantProfileApprovalStatus`) for accompanist profile upserts, re-exporting via `packages/backend/src/infra/s10-infra.ts` because `packages/backend/src/domains/teacher-directory/*` must import profile-moderation helpers through `infra/s10-infra.ts` (enforced by `architecture-boundaries.test.ts` `permitted-backend-layer`).
  - `packages/backend/src/domains/teacher-directory/teacher-directory-queries.ts`, `packages/backend/src/domains/teacher-directory/teacher-directory-repository.ts`, `packages/backend/src/repo/postgres-profile-directory-helpers.ts`, `packages/backend/src/repo/postgres-profile-directory-delegate.ts`, and `packages/backend/src/repo/in-memory-org-profiles.ts` — update accompanist profile persistence (`persistAccompanistProfileTx`, `upsertAccompanistProfileTx`, `inMemUpsertAccompanistProfile`) to auto-approve (`'approved'`) opted-in profiles and preserve `'rejected'` on conflict/update without resetting to `'pending'`; update `queryPublicDirectoryAccompanists` and `listPublicDirectoryAccompanists` to check `(e.superseded_on IS NULL OR e.superseded_on > (NOW() AT TIME ZONE o.timezone)::date)` and filter out inactive customers (`activeIds.has(row.customer_id)`, `isActiveMember: true`) matching teacher directory queries.
  - `packages/backend/src/domains/teacher-directory/participant-directory-service.ts` — update `upsertAccompanistProfile` to require an active `accompanist_membership` grant (`status === "active"`) when creating a profile or opting in (`!existing || parsed.publicDirectoryOptIn`), while allowing expired/revoked members with an existing profile to opt out (`publicDirectoryOptIn: false`), matching `upsertTeacherProfile`.
- Frontend (`<= 500` lines/file):
  - `packages/frontend/src/lib/api/commerce.ts` — remove `staffAccessConsent` from `acquireAccompanistMembership` payload signature (`<= 500` lines).
  - `packages/frontend/src/lib/api/directory.ts` (and `packages/frontend/src/lib/api.ts` re-exports if needed) — add `getCustomerAccompanistProfile` (`404` -> `null`), `upsertCustomerAccompanistProfile`, `listAdminAccompanistProfiles`, and `updateAdminAccompanistProfileApproval` (plus `AccompanistProfileRecord` type export).
  - `packages/frontend/src/pages/AccompanistMembershipPage.tsx` — remove `staffAccessConsent` state, consent checkbox, and Privacy Policy paragraph; load `getCustomerAccompanistProfile(props.slug)` inside `loadAfterCustomerSession` to initialize an explicit Public Directory opt-in checkbox (`true` when `existingProfile === null`, `existingProfile.public_directory_opt_in` when renewing so existing opt-outs stay `false`); after `acquireAccompanistMembership`, call `upsertCustomerAccompanistProfile` with `{ displayName: name().trim(), publicDirectoryOptIn, divisionIds: selected() }` before redirecting to `/org/:slug/account/memberships`.
  - `packages/frontend/src/pages/teacherDirectoryHelpers.ts`, `packages/frontend/src/pages/CustomerTeacherDirectoryCard.tsx` (and/or a dedicated `<= 500`L accompanist/participant directory card component), and `packages/frontend/src/pages/CustomerAccountMembershipsPage.tsx` — render a self-service Public Directory card for active `accompanist_membership` holders (`hasActiveAccompanistMembership`) preserving `S17`'s `Acquire Memberships` H1 and button row; parameterizing `CustomerTeacherDirectoryCard.tsx` must preserve the exact `"Public Teacher Directory"` heading text for the Teacher card (`packages/frontend/tests/browser/account-return.tsx` L136).
  - `packages/frontend/src/pages/AdminTeacherDirectoryPanel.tsx` and `packages/frontend/src/pages/adminTeacherDirectoryHelpers.ts` — load and display both Teacher and Accompanist directory profiles (`listAdminAccompanistProfiles`) with role indicators and one-click `updateAdminAccompanistProfileApproval` (`approved <-> rejected`, `pending -> approved`) moderation.
  - `packages/frontend/src/pages/publicDirectoryHelpers.ts` — update `isEligibleDirectoryProfile` and `partitionDirectoryProfiles` so `role === "Accompanist"` requires `profile.isActiveMember === true` matching `role === "Teacher"`.
- Tests, changelog & packet artifacts:
  - Common schema tests: `packages/common/tests/schemas.test.ts`.
  - Backend unit and PostgreSQL 17 integration tests: `packages/backend/tests/domains/teacher-directory/teacher-directory.test.ts`, `packages/backend/tests/accompanist-membership-service.test.ts`, `packages/backend/tests/customer-membership.routes.test.ts`, `packages/backend/tests/participant-profile-membership.test.ts`, `packages/backend/tests/participant-profile-routes.test.ts`, `packages/backend/tests/profile-repository.test.ts`, `packages/backend/tests/public-teacher-directory.integration.test.ts`.
  - Frontend unit and component tests: `packages/frontend/tests/api/api-clients.test.ts`, `packages/frontend/tests/accompanist-membership.test.ts`, `packages/frontend/tests/public-directory.test.ts`, `packages/frontend/tests/teacher-directory-management.test.ts`, `packages/frontend/tests/customer-account.test.ts`.
  - `CHANGELOG.md` (`## [0.4.0]` entries for `S17` `#417` and `S18` `#416` if updated ahead of `S14`), `tasks/s18-issue-416-accompanist-public-directory-parity/spec.md`, `tasks/s18-issue-416-accompanist-public-directory-parity/code-review.md`, and the `S18` status flip in `specs/pre-thanksgiving-program.md`.

### Out of scope
- `database/**` (`0` SQL migrations; no schema changes).
- Paid Accompanist Shopify checkout and order projection (`#133`, deferred to summer per `D5`).
- Paid Teacher Membership `staffAccessConsent` (`packages/frontend/src/pages/MembershipPage.tsx`, `CustomerMembershipCheckoutPayloadSchema`, `postMembershipCheckoutHandler` in `customer-membership.routes.ts`).
- Modifying `S17`'s `<h1>Acquire Memberships</h1>` heading text, DOM placement, or `Annual Teacher` / `Annual Accompanist` button behavior on `CustomerAccountMembershipsPage.tsx`.
- Executing `S14` `main -> release` merge, `v0.4.0` tag push, or live production deployment (`deploy.yml`).

## Approach
1. **Preflight Dependency Check (`S17` Must Be `DONE`)**:
   - Run `git fetch origin --prune` and verify `origin/main:specs/pre-thanksgiving-program.md` marks `S17` (`s17-issue-417-account-membership-acquisition-buttons`) as `DONE` before creating branch `feat/s18-issue-416-accompanist-public-directory-parity` off `origin/main`.
   - Validate `s18-issue-416-accompanist-public-directory-parity` via `validate-packet.ps1` (exit `0`).
2. **Remove Copy-Pasted Accompanist `staffAccessConsent` Gate (`0` DB Migrations)**:
   - Strip `staffAccessConsent` from `AcquireAccompanistMembershipPayloadSchema` & `AcquireAccompanistMembershipRouteBodySchema` (`packages/common/src/commerce.ts`), `ALLOWED_ACCOMPANIST_FIELDS` & `parseAccompanistAcquirePayload` (`membership-entitlement-helpers.ts`), `ACCOMPANIST_ALLOWED_FIELDS` & `postAccompanistMembershipHandler` (`customer-membership.routes.ts`), `acquireAccompanistMembership` (`packages/frontend/src/lib/api/commerce.ts`), and `AccompanistMembershipPage.tsx` (removing the consent `<label>` and `<p id="accompanist-consent-required">` Privacy Policy note).
   - Keep `CUSTOMER_SESSION_COOKIE` authentication, CSRF token enforcement, `assertAllowedFields` strict payload checking (so unexpected fields still `400`), and `verifiedShopifyIdentityEmail` intact.
3. **Backend `#361` Moderation & Active-Membership Parity**:
   - Update `persistAccompanistProfileTx` (`teacher-directory-queries.ts`), `PostgresTeacherDirectoryRepository.upsertAccompanistProfile` (`teacher-directory-repository.ts`), `upsertAccompanistProfileTx` (`postgres-profile-directory-helpers.ts`), `PostgresProfileDirectoryDelegate.upsertAccompanistProfile` (`postgres-profile-directory-delegate.ts`), and `inMemUpsertAccompanistProfile` (`in-memory-org-profiles.ts`) to match Teacher `ON CONFLICT` moderation semantics (importing profile-moderation helpers in `domains/teacher-directory/*` strictly via `packages/backend/src/infra/s10-infra.ts` per `architecture-boundaries.test.ts` `permitted-backend-layer`):
     - Initial insert uses `resolveTeacherProfileApprovalStatus(null, publicDirectoryOptIn)` (`'approved'` when `publicDirectoryOptIn === true`, `'pending'` when `false`).
     - `ON CONFLICT (organization_id, customer_id) DO UPDATE` keeps `'rejected'` when existing `approval_status = 'rejected'`, sets `'approved'` when `EXCLUDED.public_directory_opt_in` is `true`, and otherwise preserves existing `approval_status` (never downgrading `'approved'` or clearing `'rejected'` on display-name/division edits or renewals).
   - Update `ParticipantDirectoryService.upsertAccompanistProfile` (`participant-directory-service.ts`) so creating a profile or opting in (`!existing || parsed.publicDirectoryOptIn`) requires an **active** `accompanist_membership` grant (checking lifecycle `status === "active"` in org timezone rather than merely any non-revoked/expired/scheduled grant), while permitting expired/revoked members who already have a profile to save `publicDirectoryOptIn: false` (`403` `active_membership_required` on opt-in without active grant).
   - Update `queryPublicDirectoryAccompanists` in both `teacher-directory-queries.ts` and `postgres-profile-directory-helpers.ts` (plus `listPublicDirectoryAccompanists` in `in-memory-org-profiles.ts`) to include `AND (e.superseded_on IS NULL OR e.superseded_on > (NOW() AT TIME ZONE o.timezone)::date)` and `.filter((row) => activeIds.has(row.customer_id))` with `isActiveMember: true`.
4. **Frontend Accompanist Registration Opt-In, Account Card & Admin Toggle (`<= 500`L/file)**:
   - Add `getCustomerAccompanistProfile`, `upsertCustomerAccompanistProfile`, `listAdminAccompanistProfiles`, and `updateAdminAccompanistProfileApproval` in `packages/frontend/src/lib/api/directory.ts` against the existing `/customer/orgs/:orgSlug/profiles/accompanist` and `/admin/orgs/:orgSlug/profiles/accompanists` routes in `participant-profile.routes.ts`.
   - On `AccompanistMembershipPage.tsx`, load `getCustomerAccompanistProfile(props.slug)` in parallel with `getCustomerProfile` and `getAccompanistMembershipForm` inside `loadAfterCustomerSession`; initialize `publicDirectoryOptIn` to `existingProfile ? existingProfile.public_directory_opt_in : true`; render the explicit Public Directory opt-in checkbox; and on submit call `acquireAccompanistMembership` followed by `upsertCustomerAccompanistProfile` before navigating to `/org/:slug/account/memberships` (surfacing a clear actionable error if profile save fails after membership grant creation).
   - On `CustomerAccountMembershipsPage.tsx`, render an accompanist Public Directory self-service card when `hasActiveAccompanistMembership(store.memberships())` is `true` (parameterizing `CustomerTeacherDirectoryCard.tsx` by role while keeping the exact `"Public Teacher Directory"` heading text on the Teacher card for `packages/frontend/tests/browser/account-return.tsx` L136, or extracting a cohesive `<= 500`L helper/component so each file stays well under `500` lines).
   - In `AdminTeacherDirectoryPanel.tsx` and `adminTeacherDirectoryHelpers.ts`, fetch `listAdminAccompanistProfiles` alongside `listAdminTeacherProfiles` and wire one-click `updateAdminAccompanistProfileApproval` (`Hide from Directory` / `Reinstate` / `Approve`) with clear `Teacher` vs `Accompanist` role badges.
   - In `publicDirectoryHelpers.ts`, require `profile.isActiveMember === true` for `Accompanist` in `isEligibleDirectoryProfile` and `partitionDirectoryProfiles`.
5. **Red-Green Verification & Code Review**:
   - Update and expand unit and PostgreSQL 17 integration suites covering: `$0` accompanist acquisition without `staffAccessConsent`, new registration pre-checked opt-in auto-appearing in `/org/:slug/directory`, unchecked opt-out remaining hidden, renewal preserving existing opt-out (`false`) and Admin `'rejected'` hide, expired/revoked/superseded accompanist immediately disappearing from `/org/:slug/directory` and allowed to opt out (`200`) but blocked from opting in (`403`), account card edits, and Admin one-click hide/reinstate.
   - Run full workspace quality gates (`<= 500`L/file, `0` warnings, `0` errors) and complete independent subagent review (`tasks/s18-issue-416-accompanist-public-directory-parity/code-review.md`).

## Verification commands
Execute natively in Windows PowerShell (`pwsh`):
```powershell
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s18-issue-416-accompanist-public-directory-parity
bun run verify:toolchain
bun run format:check
bun run lint
bun run build
bun run --cwd packages/frontend check:types
bunx --bun tsc -p packages/backend/tsconfig.json --noEmit
bun run check:sql
bun test packages/common/tests/schemas.test.ts packages/backend/tests/architecture-boundaries.test.ts packages/backend/tests/file-size-ratchet.test.ts
bun test packages/backend/tests/domains/teacher-directory/teacher-directory.test.ts packages/backend/tests/accompanist-membership-service.test.ts packages/backend/tests/customer-membership.routes.test.ts packages/backend/tests/participant-profile-membership.test.ts packages/backend/tests/participant-profile-routes.test.ts packages/backend/tests/profile-repository.test.ts packages/backend/tests/public-teacher-directory.integration.test.ts
bun test packages/frontend/tests/api/api-clients.test.ts packages/frontend/tests/accompanist-membership.test.ts packages/frontend/tests/public-directory.test.ts packages/frontend/tests/teacher-directory-management.test.ts packages/frontend/tests/customer-account.test.ts
bun run test
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s18-issue-416-accompanist-public-directory-parity -RequireCodeReview
```
Plus PostgreSQL 17 integration verification (`POSTGRES_INTEGRATION_URL` / `DATABASE_URL`) passing with `0` errors and `0` warnings.

## Delivery
Pending `S18` execution (after `S17` merges to `origin/main`).

## Quality gate results
Pending `S18` execution.
