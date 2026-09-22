# Goals Extract
- Task name: phase-2-class-purchase-entitlement
- Iteration: v4
- State: draft

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

