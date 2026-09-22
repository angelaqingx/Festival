# Goals Extract
- Task name: phase-2-class-purchase-entitlement
- Iteration: v1
- State: draft

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

