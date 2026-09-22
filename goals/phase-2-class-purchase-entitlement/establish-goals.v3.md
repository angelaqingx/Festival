# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v3
- State: locked

## Request

- Create a Phase 2 work-breakdown narrative for the remaining Festival class catalog, customer purchase, capacity/waitlist, Shopify product lifecycle, and age-snapshot work described in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.
- Record the user's approved authenticated-parent happy path: choose a child, then a division and required teacher, choose an age-eligible class, provide Festival information, proceed to Shopify checkout, and later edit that Festival information before the policy cutoff. Required Festival information is collected before checkout, so a checkout cannot start until the local information is complete.
- Then reorganize only the existing GitHub issues #141 and #143 and their relevant dependency references so their scope, status, and dependencies accurately represent the documented implementation work. Inspect and preserve the completed relationship facts: #140, #142, and #149 are closed/completed; #141 is a child of #137; #143 is a child of #138; and #141/#143 are currently closed/completed despite the documented remaining work.
- Do not create or close issues without a documented mapping in the requested Markdown narrative, and do not make silent GitHub changes.

## Approved decisions and issue mapping

- The happy-path decisions are locked: teacher is required and snapshotted on the registration; accompanist is optional with an explicit “none” choice; the initial implementation allows one class per checkout; the six-week edit cutoff is enforced server-side in the Festival timezone; and verified-payment capacity allocation remains Phase 3 work rather than browser-return or Phase 2 checkout work. The baseline #141 requirement for a positive performance-minutes value applies to the selected duration.
- Reopen and re-scope #141 for Festival-scoped class catalog work, Shopify class-product lifecycle, direct single-class checkout, metadata-before-checkout, and supporting coverage. Its narrative and issue comment must identify verified-payment capacity/waitlist allocation as a Phase 3 dependency, not Phase 2 work.
- Reopen and narrow #143 to the hard 90-day selection age-snapshot invariant, including the stale-but-future-valid snapshot test. #143 retains its dependency on the completed #141 catalog.
- Keep #140, #142, and #149 closed as completed prerequisites. Preserve #141 as a child of #137 and #143 as a child of #138. Create no issues and close no issues.
- GitHub comments on #141 and #143 are authorized only to explain these approved clarifications and mapping; they must not introduce additional scope, dependencies, or decisions.

## Assumptions

- The supplied research remains the authoritative baseline and is preserved verbatim in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`; the user's later happy path is approved Phase 2 planning scope and will be explicitly mapped to #141 rather than silently reinterpreting that baseline.
- This task is limited to planning documentation and GitHub issue organization. It authorizes no product-code, test, Shopify, or live Festival configuration changes.
- The requested narrative will use the exact filename `Phase-2-Class-Purchase-Entitlement.md` at the repository root; this is a file-placement convention, not an expansion of the research scope.
- The approved order is: authenticate/add child as a prerequisite, choose child/division/teacher/class, complete required Festival information, start a direct Shopify checkout for that class, then rely on verified paid-order processing—not a browser return—to create the entitlement. Division stays disabled until a child is selected, and teacher stays disabled until the child and division are selected. Teacher is required and snapshotted on the registration.
- Festival information consists of musical piece title, composer, movements, an optional accompanist with an explicit “none” choice, and positive performance duration. It is customer-owned, separate from the entitlement, and editable only before the server-side cutoff timestamp calculated as six weeks before Festival start in the Festival timezone; edits at or after that timestamp are rejected. Permitted edits never change the purchased class, price, capacity/waitlist position, or entitlement.
- A different child or another class for the same child starts an independent purchase flow. The initial implementation permits exactly one class per Shopify checkout. Verified-payment capacity/waitlist allocation is a Phase 3 dependency and is not performed on checkout return.
- The approved mapping retains #141 as the catalog/product/checkout work item and #143 as the age-snapshot work item dependent on the #141 catalog, preserving the supplied research numbering and existing #141 → #143 dependency. Verified-payment capacity/waitlist allocation is Phase 3 work and excluded from #141's Phase 2 scope.
- #140, #142, and #149 remain closed/completed reference dependencies; #137 and #138 remain the recorded parents of #141 and #143.

## Goals

1. Produce the requested Phase 2 Markdown narrative that explicitly separates the #141 catalog/product/checkout work from the #143 hard 90-day age-snapshot invariant, preserves all supplied implementation constraints, and maps the user's approved happy path to the locked #141 implementation scope, while documenting capacity allocation as a Phase 3 dependency.
2. In that narrative, specify the approved happy-path order—child selection enabling division, child-and-division selection enabling the required teacher, eligible class selection, complete Festival information, direct single-class Shopify checkout, then verified paid-order entitlement—and state that browser return is not payment or entitlement authority.
3. Include a complete, reviewable approved issue mapping: for #141, #143, #140, #142, #149, #137, and #138, record current known status/relationship, approved status/scope/dependency treatment, and the reason for each mutation or explicit non-mutation; every approved happy-path scope must map to an issue explicitly.
4. Record the locked happy-path rules: required, snapshotted teacher; optional accompanist with explicit “none”; title, composer, movements, and positive duration completed before checkout; one class per checkout; a server-side six-week-before-start cutoff in the Festival timezone; and Phase 3-only verified-payment capacity allocation.
5. Reorganize only the existing #141/#143 issues and relevant references exactly as documented: reopen/re-scope #141, reopen/narrow #143, and add explanatory clarification comments. Make no new issue and no issue closure, and make no change to #137/#138 parentage or #140/#142/#149 closed status.
6. Verify and report the delivered narrative, explanatory comments, and final GitHub issue status, scopes, and dependency relationships with direct links, flagging every approved decision and any variance from the locked mapping.

## Non-goals

- Product/API/UI/database/Shopify implementation, capacity algorithm changes, checkout implementation, and test execution for the Phase 2 features.
- Reopening the approved happy-path decisions or broadening them beyond the stated rules.
- Changing child/birthday prerequisites, teacher/accompanist membership policy, metadata behavior, entitlement timing, cart behavior, or capacity allocation outside an explicitly approved issue mapping; verified-payment capacity allocation itself remains out of Phase 2 scope.
- Creating new GitHub issues, closing issues, changing parent issues #137/#138, changing completed #140/#142/#149, or revising #141/#143 beyond the locked mapping.
- Writing `Phase-2-Class-Purchase-Entitlement.md` during goal establishment.

## Success criteria

- [G1] The final narrative faithfully enumerates the in-scope catalog, validation, digital/no-shipping trusted-single-variant lifecycle, authenticated checkout and deactivation, integration coverage, and hard 90-day snapshot invariant with its stale-but-future-valid test. It explicitly maps the originally listed soft capacity/waitlist allocation to the locked Phase 3 dependency rather than Phase 2 #141 work.
- [G2] The narrative identifies the approved happy path and its required order: selection precedes completed local Festival information, direct single-class Shopify checkout follows that completion, and only verified paid-order processing can create an entitlement; Festival-information edits do not change that entitlement.
- [G3] The narrative records every locked happy-path rule: teacher is required and snapshotted; accompanist is optional with an explicit “none” choice; title, composer, movements, and positive duration are complete before checkout; one class is purchased per checkout; the Festival-timezone cutoff is enforced server-side six weeks before start; and capacity allocation is Phase 3 verified-payment work.
- [G4] The final narrative contains a mapping table or equivalently complete mapping for #137, #138, #140, #141, #142, #143, and #149 that makes each approved status/scope/dependency action (including each non-action) auditable, including all selected happy-path scope.
- [G5] GitHub changes are verifiable against the locked mapping: #141 and #143 are reopened and re-scoped, explanatory comments record the approved clarifications, no issues are created or closed, #137/#138 parentage is unchanged, and #140/#142/#149 remain closed prerequisites.
- [G6] The final report provides a direct link to the narrative and direct links to every changed issue, states final status/parent/dependency relationships, reports the explanatory comments, and identifies any variance from the locked mapping.

## Next action

- Create the root `Phase-2-Class-Purchase-Entitlement.md`, then perform the approved #141/#143 updates and explanatory comments and verify the document and issue state.
