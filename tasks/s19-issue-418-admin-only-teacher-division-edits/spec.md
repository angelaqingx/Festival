# S19 — Issue `#418`: Restrict Post-Creation Teacher Division Changes to Organization Admins

## Goal reference
- Goal contract (`draft` pending `D6`): `goals/s19-issue-418-admin-only-teacher-division-edits/goals.v0.md`
- Goal establishment record (`draft` pending `D6`): `goals/s19-issue-418-admin-only-teacher-division-edits/establish-goals.v0.md`
- Master program ledger: `specs/pre-thanksgiving-program.md` (Wave 4E, `DRAFT (D6)`, depends strictly on `S18` `DONE` on `origin/main` + `D6` resolution)
- Bounded context architecture: `specs/bounded-contexts-2026.md` (`teacher-directory` bounded context & `@festival/common`)

## Scope

### In scope
- Goal lock artifacts (for Step 1.3 `draft -> locked` transition once `D6` is confirmed):
  - `goals/s19-issue-418-admin-only-teacher-division-edits/establish-goals.v0.md`
  - `goals/s19-issue-418-admin-only-teacher-division-edits/goals.v0.md`
- Shared contracts (`@festival/common`):
  - `packages/common/src/directory.ts`, `packages/common/src/profile.ts`, and `packages/common/src/index.ts` (if new schema/type exports are added) — narrow `UpsertCustomerTeacherProfileInputSchema` to `v.strictObject({ displayName, publicDirectoryOptIn })` (decoupled from `UpsertParticipantProfileInputSchema` / `UpsertCustomerAccompanistProfileInputSchema` which keeps `divisionIds`), and add `UpdateAdminTeacherProfileDivisionsBodySchema` (`v.strictObject({ divisionIds: v.array(nonEmptyText("Division ID", 200)) })`) and `UpdateAdminTeacherProfileDivisionsInputSchema`.
- Backend (`teacher-directory`, routes, facades/composition, NGINX, `<= 500` lines/file):
  - `packages/backend/src/routes/participant-profile/participant-profile.routes.ts` — keep `PUT /customer/orgs/:orgSlug/profiles/teacher` validated with narrowed `UpsertCustomerTeacherProfileInputSchema` (rejecting `divisionIds` with `400`); add `PATCH /admin/orgs/:orgSlug/profiles/teachers/:profileId/divisions` (`requireAuth`, `requireTenant`, `requireTenantRole(["Admin"])`, `jsonValidator(UpdateAdminTeacherProfileDivisionsBodySchema)`) and register its `defineRouteSecurity` (`authenticationClass: "admin"`, `csrfRequired: false`, `browserAllowed: true`) in `PARTICIPANT_PROFILE_ROUTE_SECURITY`.
  - `packages/backend/src/routes/route-groups.ts`, `packages/backend/src/routes/api-router.ts`, and `packages/backend/src/routes/route-security.ts` — propagate `DirectoryRoutesType` Hono RPC signature and route security declarations.
  - `nginx/festival.conf` and `docker/nginx.festival.conf` — widen the `/api/admin/orgs/[^/]+/profiles/...` `PATCH` regex location allowlist to permit `/api/admin/orgs/:orgSlug/profiles/teachers/:profileId/divisions`.
  - `packages/backend/src/services/participant-profile-service.ts`, `packages/backend/src/commerce/membership-status-service.ts`, `packages/backend/src/services/accompanist-membership-service.ts` (for `loadActiveTeacherRoster` / `listCurrentRoster` `directory` port wiring if needed), and `packages/backend/src/composition/teacher-directory.ts` — pass `products: repository` to `ParticipantDirectoryService`, expose `updateTeacherProfileDivisions`, and pass `directory: organizations` to `MembershipEntitlementService`.
  - `packages/backend/src/domains/teacher-directory/participant-directory-service.ts`, `packages/backend/src/domains/teacher-directory/membership-entitlement-service.ts`, `packages/backend/src/domains/teacher-directory/membership-entitlement-helpers.ts`, `packages/backend/src/domains/teacher-directory/membership-entitlement-repository.ts`, `packages/backend/src/domains/teacher-directory/teacher-directory-repository.ts`, `packages/backend/src/domains/teacher-directory/teacher-directory-queries.ts`, `packages/backend/src/domains/teacher-directory/types.ts`, and `packages/backend/src/domains/teacher-directory/index.ts` (importing any non-domain helpers strictly via `packages/backend/src/infra/s10-infra.ts` per `architecture-boundaries.test.ts`).
  - `packages/backend/src/infra/s10-infra.ts`, `packages/backend/src/repo/organization-repository.ts`, `packages/backend/src/repo/organization-repository-types.ts`, `packages/backend/src/repo/postgres-organization-repository.ts`, `packages/backend/src/repo/postgres-membership-grant-delegate.ts`, `packages/backend/src/repo/postgres-profile-directory-delegate.ts`, `packages/backend/src/repo/postgres-profile-directory-helpers.ts`, `packages/backend/src/repo/in-memory-organization-repository.ts`, `packages/backend/src/repo/in-memory-org-commerce-grants.ts`, and `packages/backend/src/repo/in-memory-org-profiles.ts` — add `updateTeacherProfileDivisions(organizationId, profileId, divisionIds)` updating `orgs.teacher_profile_divisions` atomically while preserving `approval_status` and returning `null` (`404`) when `profileId` does not belong to `organizationId`, and update `listActiveTeachersForDivision` and `findActiveTeacherEntitlementGrant` across Postgres and in-memory repositories to resolve effective active Teacher division(s) from `orgs.teacher_profile_divisions` when a `teacher_profiles` row exists (falling back to `orgs.membership_entitlement_divisions` only when no `teacher_profiles` row exists yet).
- Frontend (`<= 500` lines/file):
  - `packages/frontend/src/lib/api/directory.ts` (and `packages/frontend/src/lib/api.ts` if re-exports are added) — update `upsertCustomerTeacherProfile` input to `{ displayName, publicDirectoryOptIn }` and add `updateAdminTeacherProfileDivisions`.
  - `packages/frontend/src/pages/CustomerTeacherDirectoryCard.tsx` (plus any Accompanist directory card component introduced in `S18`), `packages/frontend/src/pages/CustomerAccountMembershipsPage.tsx`, and `packages/frontend/src/pages/teacherDirectoryHelpers.ts` — render Teacher divisions read-only without checkboxes (preserving exact `"Public Teacher Directory"` heading text), omit `divisionIds` on Teacher profile saves, enforce the organization's Accompanist division policy (`exactly_one`, `one_to_two`, `one_to_all` via `getAccompanistMembershipForm` + `validateMembershipDivisionSelection`) in the Accompanist directory card UI, and keep Teacher (read-only) vs Accompanist (editable within policy) cards independent for dual-role customers.
  - `packages/frontend/src/pages/AdminTeacherDirectoryPanel.tsx`, `packages/frontend/src/pages/adminTeacherDirectoryHelpers.ts`, optional extracted subcomponent `packages/frontend/src/pages/AdminTeacherDivisionEditor.tsx` (`<= 500` lines/file), and `packages/frontend/src/styles.css` (minimal scoped read-only/admin division editor styling if needed).
- Tests, changelog & packet artifacts:
  - Common tests: `packages/common/tests/schemas.test.ts`.
  - Backend unit, security & PostgreSQL 17 integration tests: `packages/backend/tests/participant-profile-routes.test.ts`, `packages/backend/tests/participant-profile-routes-security.test.ts`, `packages/backend/tests/participant-profile-membership.test.ts`, `packages/backend/tests/participant-profile-admin-consent.test.ts`, `packages/backend/tests/profile-repository.test.ts`, `packages/backend/tests/organization-repository.test.ts`, `packages/backend/tests/postgres-organization-repository.test.ts`, `packages/backend/tests/postgres-profile-postal-code.integration.test.ts`, `packages/backend/tests/public-teacher-directory.integration.test.ts`, `packages/backend/tests/domains/teacher-directory/teacher-directory.test.ts`, `packages/backend/tests/membership-status-service.test.ts`, `packages/backend/tests/route-security.test.ts`, and `packages/backend/tests/nginx-security.test.ts`.
  - Frontend unit & browser tests: `packages/frontend/tests/api/api-clients.test.ts`, `packages/frontend/tests/teacher-directory-management.test.ts`, `packages/frontend/tests/customer-account.test.ts`, `packages/frontend/tests/customer-membership-status.test.ts`, `packages/frontend/tests/public-directory.test.ts`, and `packages/frontend/tests/browser/account-return.tsx`.
  - `CHANGELOG.md`, `tasks/s19-issue-418-admin-only-teacher-division-edits/spec.md`, `tasks/s19-issue-418-admin-only-teacher-division-edits/code-review.md`, and `specs/pre-thanksgiving-program.md`.

### Out of scope
- `database/**` (`0` SQL migrations; `orgs.membership_entitlement_divisions` is never mutated).
- Creation-time Teacher division selection on `packages/frontend/src/pages/MembershipPage.tsx` and deferred multi-division Teacher checkout policy (`#172`).
- `catalog-repertoire` files owned in parallel by `S20` (`#359` Admin Concerto CSV import/export).

## Approach
1. **Step 1 Preflight, `S18` Gate & `D6` Goal Lock**:
   - Run `git fetch origin --prune` and confirm `origin/main:specs/pre-thanksgiving-program.md` marks `S18` (`s18-issue-416-accompanist-public-directory-parity`) as `DONE`.
   - Confirm `D6` with the user (`>= 1` active divisions vs `exactly 1` active division for Admin Teacher division edits), update `establish-goals.v0.md` and `goals.v0.md` from `- State: draft` to `- State: locked`, check `[x] D6` in `specs/pre-thanksgiving-program.md`, run `validate-packet.ps1 -TaskName s19-issue-418-admin-only-teacher-division-edits`, and branch `feat/s19-issue-418-admin-only-teacher-division-edits` off `origin/main`.
2. **Rule 1 — Customer Teacher Division Lock & Server-Side Seeding**:
   - Split `UpsertCustomerTeacherProfileInputSchema` in `packages/common/src/directory.ts` to `v.strictObject({ displayName: nonEmptyText("Display name", 100), publicDirectoryOptIn: v.boolean() })` while keeping `UpsertParticipantProfileInputSchema` (`UpsertCustomerAccompanistProfileInputSchema`) with `divisionIds` for `PUT /customer/orgs/:orgSlug/profiles/accompanist`.
   - In `ParticipantDirectoryService.upsertTeacherProfile` (`participant-directory-service.ts`), validate only `["displayName", "publicDirectoryOptIn"]` via `assertAllowedFields` (returning `400` if `divisionIds` or any extra field is sent, leaving existing DB state untouched).
   - When `existing === null` on first-time `upsertTeacherProfile`, seed `divisionIds` server-side from the customer's active `teacher_membership` grant(s) (`grants.filter(g => g.entitlementClass === "teacher_membership" && g.status === "active").map(g => g.divisionId)` deduplicated and verified against active org divisions); when `existing !== null`, pass `existing.division_ids` unchanged so customer display-name and opt-in edits never alter assigned divisions.
   - Update `CustomerTeacherDirectoryCard.tsx` to display assigned Teacher division names as a read-only summary/badge list (no `<input type="checkbox">` elements for Teacher divisions) and submit `{ displayName, publicDirectoryOptIn }` only, keeping the `"Public Teacher Directory"` heading text verbatim.
3. **Rule 2 — Organization-Admin Teacher Division Endpoint & UI (`D6`)**:
   - Add `PATCH /admin/orgs/:orgSlug/profiles/teachers/:profileId/divisions` in `participant-profile.routes.ts` (`requireAuth`, `requireTenant`, `requireTenantRole(["Admin"])`, `PARTICIPANT_PROFILE_ROUTE_SECURITY` `authenticationClass: "admin"`), update `nginx/festival.conf` + `docker/nginx.festival.conf`, and update `route-security.test.ts` + `nginx-security.test.ts`.
   - Implement `ParticipantDirectoryService.updateTeacherProfileDivisions(organizationId, profileId, payload, actorUid)`:
     - Validate `divisionIds` against active divisions in `organizationId` (`organizations.listDivisions(organizationId, true)`) and enforce the confirmed `D6` count rule (`divisionIds.length >= 1` vs `divisionIds.length === 1`), returning `400` on invalid UUIDs, duplicates/count violations, or inactive/cross-org division IDs.
     - Persist via `directory.updateTeacherProfileDivisions(organizationId, profileId, uniqueDivisionIds)` (`404` when `profileId` is missing or belongs to another organization), preserving `approval_status`, emitting `TeacherDirectoryChanged`, and returning the redacted/admin-visible `TeacherProfileRecord`.
   - Add an Admin Teacher division edit control in `AdminTeacherDirectoryPanel.tsx` (extracting `AdminTeacherDivisionEditor.tsx` if needed to stay well under `<= 500` lines/file) wired to `updateAdminTeacherProfileDivisions`.
4. **Rule 3 — Immutable Entitlement Evidence + Effective Division Resolution Across Status, Eligibility, Picker & Roster (`AC #6`)**:
   - Never mutate `orgs.membership_entitlement_divisions` in PostgreSQL (preserving creation-time purchase evidence).
   - Resolve a Teacher's effective active division(s) from `orgs.teacher_profile_divisions` whenever a `teacher_profiles` row exists for `(organization_id, customer_id)`, falling back to `orgs.membership_entitlement_divisions` **only** when no `teacher_profiles` row exists yet, across all four read/eligibility surfaces:
     1. `MembershipEntitlementService.listCustomerMembershipStatus` (`membership-entitlement-service.ts` + `MembershipStatusService`): map active `teacher_membership` `divisionName` from `teacher_profiles.division_ids` when a `teacher_profiles` row exists (keeping historical `expired`/`superseded`/`revoked` grant snapshots intact).
     2. `listActiveTeachersForDivision` (`teacher-directory-repository.ts`, `postgres-membership-grant-delegate.ts`, `in-memory-org-commerce-grants.ts`): match `tpd.division_id = $2` when a `teacher_profiles` row exists for `(organization_id, customer_id)`, otherwise `ed.division_id = $2`.
     3. `findActiveTeacherEntitlementGrant` (`membership-entitlement-repository.ts`, `postgres-membership-grant-delegate.ts`, `in-memory-organization-repository.ts`): match `tpd.division_id = $3` when a `teacher_profiles` row exists for `(organization_id, customer_id)`, otherwise `ed.division_id = $3` (so registration eligibility reflects Admin division corrections).
     4. `loadActiveTeacherRoster` (`membership-entitlement-helpers.ts` / `membership-entitlement-service.ts` / `accompanist-membership-service.ts`): populate active Teacher `divisions` from `teacher_profiles.division_ids` mapped to org division names when a `teacher_profiles` row exists, falling back to `grant.divisionId` / `grant.divisionNameSnapshot` when no `teacher_profiles` row exists yet.
   - In `CustomerAccountMembershipsPage.tsx`, trigger `refreshMembershipStatus(store)` / pass synchronized division state so Account `Memberships`, Account `Public Teacher Directory` (read-only), Admin panel/roster, registration Teacher pickers/eligibility, and `/org/:slug/directory` all display and enforce the exact Admin-corrected division(s).
5. **Rule 4 — Accompanist Division Policy Enforcement & Dual-Role Independence (`AC #9`–`#11`)**:
   - In `ParticipantDirectoryService.upsertAccompanistProfile`, validate `parsed.divisionIds` against active org divisions (`organizations.listDivisions(organizationId, true)`) and the organization's current Accompanist division policy (`products.getAccompanistDivisionPolicy(organizationId)` + `validateMembershipDivisionSelection` from `@festival/common`) whenever `parsed.divisionIds` is persisted—returning `400` without mutating `accompanist_profiles` if out of policy (`exactly_one`, `one_to_two`, `one_to_all`) or referencing an inactive/foreign division.
   - In the Customer Account Accompanist directory card UI, load `{ policy, divisions }` via `getAccompanistMembershipForm(slug)` and disable/prevent out-of-policy division selections client-side with clear guidance under `exactly_one`, `one_to_two`, and `one_to_all`.
   - Verify dual-role accounts holding both active `teacher_membership` and active `accompanist_membership` render Teacher divisions read-only while keeping Accompanist divisions editable within the configured Accompanist policy.

## Verification commands
Execute natively in Windows PowerShell (`pwsh`):
```powershell
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s19-issue-418-admin-only-teacher-division-edits
bun run verify:toolchain
bun run format:check
bun run lint
bun run build
bun run --cwd packages/frontend check:types
bunx --bun tsc -p packages/backend/tsconfig.json --noEmit
bun run check:sql
bun test packages/common/tests/schemas.test.ts packages/backend/tests/architecture-boundaries.test.ts packages/backend/tests/file-size-ratchet.test.ts packages/backend/tests/route-security.test.ts packages/backend/tests/nginx-security.test.ts
bun test packages/backend/tests/domains/teacher-directory/teacher-directory.test.ts packages/backend/tests/participant-profile-routes.test.ts packages/backend/tests/participant-profile-routes-security.test.ts packages/backend/tests/participant-profile-membership.test.ts packages/backend/tests/participant-profile-admin-consent.test.ts packages/backend/tests/profile-repository.test.ts packages/backend/tests/organization-repository.test.ts packages/backend/tests/postgres-organization-repository.test.ts packages/backend/tests/membership-status-service.test.ts packages/backend/tests/postgres-profile-postal-code.integration.test.ts packages/backend/tests/public-teacher-directory.integration.test.ts
bun test packages/frontend/tests/api/api-clients.test.ts packages/frontend/tests/teacher-directory-management.test.ts packages/frontend/tests/customer-account.test.ts packages/frontend/tests/customer-membership-status.test.ts packages/frontend/tests/public-directory.test.ts
bun run test
pwsh -NoProfile -File .agents/skills/festival-session/scripts/validate-packet.ps1 -TaskName s19-issue-418-admin-only-teacher-division-edits -RequireCodeReview
```
Plus PostgreSQL 17 integration verification (`POSTGRES_INTEGRATION_URL` / `DATABASE_URL`) passing with `0` errors and `0` warnings.

## Delivery
Pending `D6` resolution, `S18` merge to `origin/main`, and `S19` execution.

## Quality gate results
Pending `S19` execution.
