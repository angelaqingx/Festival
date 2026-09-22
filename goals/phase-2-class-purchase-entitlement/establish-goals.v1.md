# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v1
- State: draft

## Request

- Create a Phase 2 work-breakdown narrative for the remaining Festival class catalog, customer purchase, capacity/waitlist, Shopify product lifecycle, and age-snapshot work described in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.
- Record the user's proposed authenticated-parent happy path as a clearly identified scope expansion: choose a child, then a division and teacher, choose an age-eligible class, provide Festival information, proceed to Shopify checkout, and later edit that Festival information before the policy cutoff. Recommend the order that collects required Festival information before Shopify checkout, so a checkout cannot start until the local information is complete.
- Then reorganize only the existing GitHub issues #141 and #143 and their relevant dependency references so their scope, status, and dependencies accurately represent the documented implementation work. Inspect and preserve the completed relationship facts: #140, #142, and #149 are closed/completed; #141 is a child of #137; #143 is a child of #138; and #141/#143 are currently closed/completed despite the documented remaining work.
- Do not create or close issues without a documented mapping in the requested Markdown narrative, and do not make silent GitHub changes.

## Blocking ambiguity

- Approval is required before GitHub mutations. Confirm the proposed issue mapping in the final narrative—specifically whether #141 and #143 should be reopened and retitled/re-scoped as the two remaining-work tracking issues, with their parent/dependency references updated to show #140/#142/#149 as completed inputs—or direct a different mapping.
- The happy path is a proposal, not locked scope. Before it can be folded into #141 or #143, resolve and approve: whether teacher selection is required and snapshotted; whether an accompanist is required; piece, movement, and duration validation; a single-class direct checkout versus a multi-line cart; the exact festival-timezone and boundary semantics for the six-week edit cutoff; and whether the #141 soft-capacity/waitlist work is Phase 2 implementation or a Phase 3 dependency.

## Assumptions

- The supplied research remains the authoritative baseline and is preserved verbatim in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`; the user's later happy path is a proposed, separately labeled scope expansion rather than a silent reinterpretation of that baseline.
- This task is limited to planning documentation and GitHub issue organization. It authorizes no product-code, test, Shopify, or live Festival configuration changes.
- The requested narrative will use the exact filename `Phase-2-Class-Purchase-Entitlement.md` at the repository root; this is a file-placement convention, not an expansion of the research scope.
- The recommended order is: authenticate/add child as a prerequisite, choose child/division/teacher/class, complete required Festival information, start a direct Shopify checkout for that class, then rely on verified paid-order processing—not a browser return—to create the entitlement. In the proposed selection UI, division stays disabled until a child is selected, and teacher stays disabled until the child and division are selected. This is a proposed UX and authority boundary, not implementation authorization.
- Festival-information edits are proposed to be customer-owned, separate from the entitlement, and rejected after the exact six-week-before-start cutoff; any permitted edit must not change the purchased class, price, capacity/waitlist position, or entitlement. The exact policy is unresolved.
- A different child or another class for the same child is proposed to start an independent purchase flow; duplicate-entry, cart, and capacity policy remain unresolved.
- The default proposed mapping is to retain #141 as the catalog/product/checkout/capacity work item and #143 as the age-snapshot work item dependent on the completed catalog work, because that preserves the supplied research numbering and the existing #141 → #143 dependency. This is a proposal, not an approved mutation.
- #140, #142, and #149 remain closed/completed reference dependencies; #137 and #138 remain the recorded parents of #141 and #143 unless the approved narrative explicitly documents a different relationship.

## Goals

1. Produce the requested Phase 2 Markdown narrative that explicitly separates the five remaining #141 work areas from the #143 hard 90-day age-snapshot invariant, preserves all supplied implementation constraints, and labels the user's happy path as a proposed scope expansion.
2. In that narrative, specify the recommended proposed happy-path order—child selection enabling division, child-and-division selection enabling teacher, eligible class selection, required Festival information, direct Shopify checkout, then verified paid-order entitlement—and state that browser return is not payment or entitlement authority.
3. Include a complete, reviewable issue mapping before any GitHub change: for #141, #143, #140, #142, #149, #137, and #138, record current known status/relationship, intended status/scope/dependency treatment, and the reason for each planned mutation or explicit non-mutation; any approved happy-path scope must map to an issue explicitly.
4. Keep the happy-path decisions unresolved and visible until user approval: teacher requirement/snapshot, accompanist requiredness, piece/movement/duration validation, direct single-class checkout versus multi-line cart, exact six-week cutoff timezone/boundary, and the #141/Phase 3 capacity relationship.
5. After explicit approval of both the issue mapping and any selected happy-path scope, reorganize only the existing #141/#143 issues and relevant references exactly as documented, with no new issue creation and no issue closure/reopening/retitle/body/dependency change that lacks a corresponding narrative mapping.
6. Verify and report the delivered narrative and final GitHub issue status, scopes, and dependency relationships with direct links, flagging every approved decision and any remaining approval need.

## Non-goals

- Product/API/UI/database/Shopify implementation, capacity algorithm changes, checkout implementation, and test execution for the Phase 2 features.
- Treating the proposed happy path as approved implementation scope, or inventing answers to its unresolved policy decisions.
- Changing child/birthday prerequisites, teacher/accompanist membership policy, metadata behavior, entitlement timing, cart behavior, or capacity allocation outside an explicitly approved issue mapping.
- Creating new GitHub issues, closing issues, changing parent issues #137/#138, or changing completed #140/#142/#149 unless the final narrative maps and the user explicitly approves that change.
- Writing `Phase-2-Class-Purchase-Entitlement.md` during goal establishment.

## Success criteria

- [G1] The final narrative faithfully enumerates all six supplied remaining-work items, including immutable catalog fields, validation rules, digital/no-shipping trusted-single-variant lifecycle, authenticated/concurrency-safe checkout and deactivation behavior, integration coverage, and the hard 90-day snapshot invariant with its stale-but-future-valid test.
- [G2] The narrative separately identifies the proposed happy path and its recommended order: selection precedes required local Festival information, direct Shopify checkout follows local completion, and only verified paid-order processing can create an entitlement; Festival-information edits do not change that entitlement.
- [G3] The narrative enumerates each unresolved happy-path policy decision—teacher requirement/snapshot, accompanist requiredness, piece/movement/duration validation, checkout shape, six-week cutoff timezone/boundary, and capacity Phase 3 relationship—without silently choosing an answer.
- [G4] The final narrative contains a mapping table or equivalently complete mapping for #137, #138, #140, #141, #142, #143, and #149 that makes each status/scope/dependency action (including each non-action) auditable before GitHub mutation, including any selected happy-path scope.
- [G5] Before approval, repository changes contain only the v1 goal-setting artifacts and no GitHub mutations or requested Phase 2 narrative deliverable. After approval, GitHub changes can be verified against the narrative mapping with no unmapped new, closed, reopened, retitled, re-scoped, or dependency-changed issue.
- [G6] The final report provides a direct link to the narrative and direct links to every changed issue, states final status/parent/dependency relationships, and calls out every remaining approval need.

## Next action

- Request explicit approval of the issue mapping and the selected happy-path decisions. Until that approval is supplied, do not write the requested Phase 2 narrative or mutate GitHub issues.
