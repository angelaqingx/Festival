# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v4
- State: draft

## Request

- Create a Phase 2 work-breakdown narrative for the remaining Festival class catalog, customer purchase, capacity/waitlist, Shopify product lifecycle, and age-snapshot work described in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.
- Record the user's approved authenticated-parent happy path: choose a child, then a division and required teacher, choose an age-eligible class, provide Festival information, proceed to Shopify checkout, and later edit that Festival information before the policy cutoff. Required Festival information is collected before checkout, so a checkout cannot start until the local information is complete.
- Then reorganize only the existing GitHub issues #141 and #143 and their relevant dependency references so their scope, status, and dependencies accurately represent the documented implementation work. Inspect and preserve the completed relationship facts: #140, #142, and #149 are closed/completed; #141 is a child of #137; #143 is a child of #138; and #141/#143 are currently closed/completed despite the documented remaining work.
- Do not create or close issues without a documented mapping in the requested Markdown narrative, and do not make silent GitHub changes.
- Reaffirm through automated tests that Shopify orders already appear on the authenticated parent's membership-facing account surface. Add a tenant- and customer-isolated Classes sub-page under the authenticated customer account, reachable from account navigation with a small graduation-hat icon. It must present that parent's purchased class entitlements as responsive small cards containing class name, purchase date/time, and associated child name.

## Approved decisions and issue mapping

- The happy-path decisions are locked: teacher is required and snapshotted on the registration; accompanist is optional with an explicit “none” choice; the initial implementation allows one class per checkout; the six-week edit cutoff is enforced server-side in the Festival timezone; and verified-payment capacity allocation remains Phase 3 work rather than browser-return or Phase 2 checkout work. The baseline #141 requirement for a positive performance-minutes value applies to the selected duration.
- Reopen and re-scope #141 for Festival-scoped class catalog work, Shopify class-product lifecycle, direct single-class checkout, metadata-before-checkout, and supporting coverage. Its narrative and issue comment must identify verified-payment capacity/waitlist allocation as a Phase 3 dependency, not Phase 2 work.
- Reopen and narrow #143 to the hard 90-day selection age-snapshot invariant, including the stale-but-future-valid snapshot test. #143 retains its dependency on the completed #141 catalog.
- Keep #140, #142, and #149 closed as completed prerequisites. Preserve #141 as a child of #137 and #143 as a child of #138. Create no issues and close no issues.
- GitHub comments on #141 and #143 are authorized only to explain these approved clarifications and mapping; they must not introduce additional scope, dependencies, or decisions.
- The new authenticated Account Classes surface is proposed as additional #141 implementation scope. This v4 goal-drafting iteration authorizes no GitHub issue mutation; any later #141 update must document this mapping and preserve the locked #141 → #143 catalog/snapshot dependency.

## Assumptions

- The supplied research remains the authoritative baseline and is preserved verbatim in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`; the user's later happy path is approved Phase 2 planning scope and will be explicitly mapped to #141 rather than silently reinterpreting that baseline.
- This task is limited to planning documentation and GitHub issue organization. It authorizes no product-code, test, Shopify, or live Festival configuration changes.
- The requested narrative will use the exact filename `Phase-2-Class-Purchase-Entitlement.md` at the repository root; this is a file-placement convention, not an expansion of the research scope.
- The approved order is: authenticate/add child as a prerequisite, choose child/division/teacher/class, complete required Festival information, start a direct Shopify checkout for that class, then rely on verified paid-order processing—not a browser return—to create the entitlement. Division stays disabled until a child is selected, and teacher stays disabled until the child and division are selected. Teacher is required and snapshotted on the registration.
- Festival information consists of musical piece title, composer, movements, an optional accompanist with an explicit “none” choice, and positive performance duration. It is customer-owned, separate from the entitlement, and editable only before the server-side cutoff timestamp calculated as six weeks before Festival start in the Festival timezone; edits at or after that timestamp are rejected. Permitted edits never change the purchased class, price, capacity/waitlist position, or entitlement.
- A different child or another class for the same child starts an independent purchase flow. The initial implementation permits exactly one class per Shopify checkout. Verified-payment capacity/waitlist allocation is a Phase 3 dependency and is not performed on checkout return.
- The approved mapping retains #141 as the catalog/product/checkout work item and #143 as the age-snapshot work item dependent on the #141 catalog, preserving the supplied research numbering and existing #141 → #143 dependency. Verified-payment capacity/waitlist allocation is Phase 3 work and excluded from #141's Phase 2 scope.
- #140, #142, and #149 remain closed/completed reference dependencies; #137 and #138 remain the recorded parents of #141 and #143.
- Shopify-order visibility on the parent's membership-facing account surface is existing behavior, not a requested replacement, redesign, or new source of truth. The implementation must reaffirm it with automated tests while keeping its established authorization and tenant isolation behavior.
- The new Classes page is an authenticated account sub-page. It may show only purchased class entitlements owned by the current authenticated customer within the current tenant; it must never expose another customer or tenant's class, purchase, child, or order-derived data.
- Each card represents one purchased class entitlement created by verified paid-order processing, consistent with the locked one-class-per-checkout rule. It shows its class name, the associated child's name, and a clearly labelled purchase date/time derived from the canonical paid purchase timestamp. Date/time formatting and timezone presentation follow the established account convention; if none exists, the implementation must choose and test a deterministic locale-aware presentation that makes the timezone unambiguous.
- Account navigation includes an accessible Classes destination with a small graduation-hat icon and visible or programmatic accessible name. The icon itself must not be the only means of identifying or operating the destination.
- The Classes page defines and tests: a loading state that does not present stale/misidentified cards as current results; an empty state for a parent with no purchased class entitlements; a recoverable error state that reveals no partial cross-customer data; and semantic card/navigation structure usable by keyboard and assistive technologies.

## Goals

1. Produce the requested Phase 2 Markdown narrative that explicitly separates the #141 catalog/product/checkout work from the #143 hard 90-day age-snapshot invariant, preserves all supplied implementation constraints, and maps the user's approved happy path to the locked #141 implementation scope, while documenting capacity allocation as a Phase 3 dependency.
2. In that narrative, specify the approved happy-path order—child selection enabling division, child-and-division selection enabling the required teacher, eligible class selection, complete Festival information, direct single-class Shopify checkout, then verified paid-order entitlement—and state that browser return is not payment or entitlement authority.
3. Include a complete, reviewable approved issue mapping: for #141, #143, #140, #142, #149, #137, and #138, record current known status/relationship, approved status/scope/dependency treatment, and the reason for each mutation or explicit non-mutation; every approved happy-path scope must map to an issue explicitly.
4. Record the locked happy-path rules: required, snapshotted teacher; optional accompanist with explicit “none”; title, composer, movements, and positive duration completed before checkout; one class per checkout; a server-side six-week-before-start cutoff in the Festival timezone; and Phase 3-only verified-payment capacity allocation.
5. Reorganize only the existing #141/#143 issues and relevant references exactly as documented: reopen/re-scope #141, reopen/narrow #143, and add explanatory clarification comments. Make no new issue and no issue closure, and make no change to #137/#138 parentage or #140/#142/#149 closed status.
6. Verify and report the delivered narrative, explanatory comments, and final GitHub issue status, scopes, and dependency relationships with direct links, flagging every approved decision and any variance from the locked mapping.
7. Reaffirm with automated tests that already-completed Shopify orders remain visible only on the authenticated parent's membership-facing account surface, without replacing that surface or changing its existing customer/tenant authorization behavior.
8. Add an authenticated Account Classes sub-page and account-navigation destination with a small graduation-hat icon. The page must render only the current tenant and authenticated parent's purchased class entitlements in a responsive small-card grid.
9. Make every purchased-class card identify the purchased class, associated child, and purchase date/time, and define accessible, secure loading, empty, and recoverable-error states for the Classes page.
10. Document the Account Classes addition as proposed #141 scope, while making no GitHub mutation in this goal-drafting iteration and preserving every prior locked Phase 2 decision and dependency boundary.

## Non-goals

- Product/API/UI/database/Shopify implementation, capacity algorithm changes, checkout implementation, and test execution for Phase 2 features other than the narrowly scoped existing-order visibility regression coverage and authenticated Account Classes surface defined in this v4 draft.
- Reopening the approved happy-path decisions or broadening them beyond the stated rules.
- Changing child/birthday prerequisites, teacher/accompanist membership policy, metadata behavior, entitlement timing, cart behavior, or capacity allocation outside an explicitly approved issue mapping; verified-payment capacity allocation itself remains out of Phase 2 scope.
- Creating new GitHub issues, closing issues, changing parent issues #137/#138, changing completed #140/#142/#149, or revising #141/#143 beyond the locked mapping.
- Writing `Phase-2-Class-Purchase-Entitlement.md` during goal establishment.
- Replacing, moving, or redesigning the existing membership-facing Shopify-order display; this scope only reaffirms it through tests.
- Exposing raw Shopify order payloads, checkout data, payment credentials, another tenant's data, or another customer's class entitlements, children, or purchase history.
- Changing entitlement timing, ownership, price, catalog eligibility, customer authentication, the single-class checkout rule, the six-week Festival-timezone edit cutoff, or Phase 3 verified-payment capacity allocation.
- Creating a multi-class cart, a new class entitlement lifecycle, class-registration editing behavior, or capacity/waitlist allocation behavior.
- Editing #141, #143, or any other GitHub issue in this v4 goal-drafting iteration.

## Success criteria

- [G1] The final narrative faithfully enumerates the in-scope catalog, validation, digital/no-shipping trusted-single-variant lifecycle, authenticated checkout and deactivation, integration coverage, and hard 90-day snapshot invariant with its stale-but-future-valid test. It explicitly maps the originally listed soft capacity/waitlist allocation to the locked Phase 3 dependency rather than Phase 2 #141 work.
- [G2] The narrative identifies the approved happy path and its required order: selection precedes completed local Festival information, direct single-class Shopify checkout follows that completion, and only verified paid-order processing can create an entitlement; Festival-information edits do not change that entitlement.
- [G3] The narrative records every locked happy-path rule: teacher is required and snapshotted; accompanist is optional with an explicit “none” choice; title, composer, movements, and positive duration are complete before checkout; one class is purchased per checkout; the Festival-timezone cutoff is enforced server-side six weeks before start; and capacity allocation is Phase 3 verified-payment work.
- [G4] The final narrative contains a mapping table or equivalently complete mapping for #137, #138, #140, #141, #142, #143, and #149 that makes each approved status/scope/dependency action (including each non-action) auditable, including all selected happy-path scope.
- [G5] GitHub changes are verifiable against the locked mapping: #141 and #143 are reopened and re-scoped, explanatory comments record the approved clarifications, no issues are created or closed, #137/#138 parentage is unchanged, and #140/#142/#149 remain closed prerequisites.
- [G6] The final report provides a direct link to the narrative and direct links to every changed issue, states final status/parent/dependency relationships, reports the explanatory comments, and identifies any variance from the locked mapping.
- [G7] Automated tests demonstrate that completed Shopify orders remain visible on the authenticated parent's existing membership-facing account surface and cannot be read by an unauthenticated, different-customer, or different-tenant account context.
- [G8] The authenticated account exposes a Classes destination in its navigation with a small graduation-hat icon and an accessible name; it resolves to the new Classes sub-page without removing or repurposing existing account destinations.
- [G9] With eligible purchased class entitlements, the Classes sub-page displays a responsive grid of small cards. Each card visibly and accessibly provides class name, associated child name, and an unambiguous purchase date/time, and the results are restricted to the current customer and tenant.
- [G10] The Classes sub-page has automated coverage for loading, no-purchases empty, and recoverable-error states. Its navigation and card content are keyboard-accessible and correctly named for assistive technologies; errors and loading states do not expose stale or cross-customer data.
- [G11] The implementation plan and later issue update map the new Account Classes work to #141, while this iteration performs no GitHub mutation and preserves all previously locked happy-path decisions and Phase 3 capacity boundary.

## Next action

- Obtain explicit approval of this v4 draft before implementation. After approval, hand the locked goals to implementation; any #141 issue update must be separately documented and authorized.
