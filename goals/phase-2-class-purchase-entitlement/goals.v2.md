# Goals Extract
- Task name: phase-2-class-purchase-entitlement
- Iteration: v2
- State: draft

## Goals

1. Produce the requested Phase 2 Markdown narrative that explicitly separates the five remaining #141 work areas from the #143 hard 90-day age-snapshot invariant, preserves all supplied implementation constraints, and maps the user's approved happy path to the proposed #141 implementation scope.
2. In that narrative, specify the approved happy-path order—child selection enabling division, child-and-division selection enabling the required teacher, eligible class selection, complete Festival information, direct single-class Shopify checkout, then verified paid-order entitlement—and state that browser return is not payment or entitlement authority.
3. Include a complete, reviewable issue mapping before any GitHub change: for #141, #143, #140, #142, #149, #137, and #138, record current known status/relationship, intended status/scope/dependency treatment, and the reason for each planned mutation or explicit non-mutation; any approved happy-path scope must map to an issue explicitly.
4. Record the locked happy-path rules: required, snapshotted teacher; optional accompanist with explicit “none”; title, composer, movements, and positive duration completed before checkout; one class per checkout; a server-side six-week-before-start cutoff in the Festival timezone; and Phase 3-only verified-payment capacity allocation.
5. After explicit approval of the proposed issue mapping, reorganize only the existing #141/#143 issues and relevant references exactly as documented, with no new issue creation and no issue closure/reopening/retitle/body/dependency change that lacks a corresponding narrative mapping.
6. Verify and report the delivered narrative and final GitHub issue status, scopes, and dependency relationships with direct links, flagging every approved decision and any remaining approval need.


## Non-goals

- Product/API/UI/database/Shopify implementation, capacity algorithm changes, checkout implementation, and test execution for the Phase 2 features.
- Reopening the approved happy-path decisions or broadening them beyond the stated rules.
- Changing child/birthday prerequisites, teacher/accompanist membership policy, metadata behavior, entitlement timing, cart behavior, or capacity allocation outside an explicitly approved issue mapping; verified-payment capacity allocation itself remains out of Phase 2 scope.
- Creating new GitHub issues, closing issues, changing parent issues #137/#138, or changing completed #140/#142/#149 unless the final narrative maps and the user explicitly approves that change.
- Writing `Phase-2-Class-Purchase-Entitlement.md` during goal establishment.


## Success criteria

- [G1] The final narrative faithfully enumerates all six supplied remaining-work items, including immutable catalog fields, validation rules, digital/no-shipping trusted-single-variant lifecycle, authenticated checkout and deactivation behavior, integration coverage, and the hard 90-day snapshot invariant with its stale-but-future-valid test. It identifies soft capacity/waitlist allocation as the locked Phase 3 dependency rather than Phase 2 work.
- [G2] The narrative identifies the approved happy path and its required order: selection precedes completed local Festival information, direct single-class Shopify checkout follows that completion, and only verified paid-order processing can create an entitlement; Festival-information edits do not change that entitlement.
- [G3] The narrative records every locked happy-path rule: teacher is required and snapshotted; accompanist is optional with an explicit “none” choice; title, composer, movements, and positive duration are complete before checkout; one class is purchased per checkout; the Festival-timezone cutoff is enforced server-side six weeks before start; and capacity allocation is Phase 3 verified-payment work.
- [G4] The final narrative contains a mapping table or equivalently complete mapping for #137, #138, #140, #141, #142, #143, and #149 that makes each status/scope/dependency action (including each non-action) auditable before GitHub mutation, including any selected happy-path scope.
- [G5] Before issue-mapping approval, repository changes contain only planning artifacts and no GitHub mutations or requested Phase 2 narrative deliverable. After approval, GitHub changes can be verified against the narrative mapping with no unmapped new, closed, reopened, retitled, re-scoped, or dependency-changed issue.
- [G6] The final report provides a direct link to the narrative and direct links to every changed issue, states final status/parent/dependency relationships, and calls out the still-required issue-mapping approval before a GitHub mutation.

