# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v0
- State: ready-for-confirmation

## Request

- Create a Phase 2 work-breakdown narrative for the remaining Festival class catalog, customer purchase, capacity/waitlist, Shopify product lifecycle, and age-snapshot work described in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.
- Then reorganize only the existing GitHub issues #141 and #143 and their relevant dependency references so their scope, status, and dependencies accurately represent the documented implementation work. Inspect and preserve the completed relationship facts: #140, #142, and #149 are closed/completed; #141 is a child of #137; #143 is a child of #138; and #141/#143 are currently closed/completed despite the documented remaining work.
- Do not create or close issues without a documented mapping in the requested Markdown narrative, and do not make silent GitHub changes.

## Blocking ambiguity

- Approval is required before GitHub mutations. Confirm the proposed issue mapping in the final narrative—specifically whether #141 and #143 should be reopened and retitled/re-scoped as the two remaining-work tracking issues, with their parent/dependency references updated to show #140/#142/#149 as completed inputs—or direct a different mapping.

## Assumptions

- The supplied research is authoritative and must be consumed verbatim without expanding scope. It is already present at `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md` and is not edited by this goal-setting task.
- This task is limited to planning documentation and GitHub issue organization. It authorizes no product-code, test, Shopify, or live Festival configuration changes.
- The requested narrative will use the exact filename `Phase-2-Class-Purchase-Entitlement.md` at the repository root; this is a file-placement convention, not an expansion of the research scope.
- The default proposed mapping is to retain #141 as the catalog/product/checkout/capacity work item and #143 as the age-snapshot work item dependent on the completed catalog work, because that preserves the supplied research numbering and the existing #141 → #143 dependency. This is a proposal, not an approved mutation.
- #140, #142, and #149 remain closed/completed reference dependencies; #137 and #138 remain the recorded parents of #141 and #143 unless the approved narrative explicitly documents a different relationship.

## Goals

1. Produce the requested Phase 2 Markdown narrative from the supplied research only, explicitly separating the five remaining #141 work areas from the #143 hard 90-day age-snapshot invariant and preserving all stated implementation constraints.
2. Include a complete, reviewable issue mapping in that narrative before any GitHub change: for #141, #143, #140, #142, #149, #137, and #138, record current known status/relationship, intended status/scope/dependency treatment, and the reason for each planned mutation or explicit non-mutation.
3. After explicit approval of that mapping, reorganize only the existing #141/#143 issues and relevant references exactly as documented, with no new issue creation and no issue closure/reopening/retitle/body/dependency change that lacks a corresponding narrative mapping.
4. Verify and report the delivered narrative and final GitHub issue status, scopes, and dependency relationships with direct links, flagging every approved decision and any remaining approval need.

## Non-goals

- Product/API/UI/database/Shopify implementation, capacity algorithm changes, checkout implementation, and test execution for the Phase 2 features.
- Expanding the supplied remaining-work research or inventing additional class-purchase requirements.
- Creating new GitHub issues, closing issues, changing parent issues #137/#138, or changing completed #140/#142/#149 unless the final narrative maps and the user explicitly approves that change.
- Writing `Phase-2-Class-Purchase-Entitlement.md` during goal establishment.

## Success criteria

- [G1] The final narrative quotes or faithfully enumerates all six supplied remaining-work items without adding implementation scope, including immutable catalog fields, validation rules, digital/no-shipping trusted-single-variant lifecycle, authenticated/concurrency-safe checkout and deactivation behavior, integration coverage, and the hard 90-day snapshot invariant with its stale-but-future-valid test.
- [G2] The final narrative contains a mapping table or equivalently complete mapping for #137, #138, #140, #141, #142, #143, and #149 that makes each status/scope/dependency action (including each non-action) auditable before GitHub mutation.
- [G3] Before approval, repository changes contain only the goal-setting artifacts and no GitHub mutations or requested Phase 2 narrative deliverable. After approval, GitHub changes can be verified against the narrative mapping with no unmapped new, closed, reopened, retitled, re-scoped, or dependency-changed issue.
- [G4] The final report provides a direct link to the narrative and direct links to every changed issue, states final status/parent/dependency relationships, and calls out any decision requiring user approval.

## Next action

- Request explicit approval of the proposed issue mapping. Until that approval is supplied, do not write the requested Phase 2 narrative or mutate GitHub issues.
