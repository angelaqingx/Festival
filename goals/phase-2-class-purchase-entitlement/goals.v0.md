# Goals Extract
- Task name: phase-2-class-purchase-entitlement
- Iteration: v0
- State: ready-for-confirmation

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

