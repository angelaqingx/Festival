# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v2
- State: draft

## Request

- Create a Phase 2 work-breakdown narrative for the remaining Festival class catalog, customer purchase, capacity/waitlist, Shopify product lifecycle, and age-snapshot work described in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.
- Record the user's approved authenticated-parent happy path: choose a child, then a division and required teacher, choose an age-eligible class, provide Festival information, proceed to Shopify checkout, and later edit that Festival information before the policy cutoff. Required Festival information is collected before checkout, so a checkout cannot start until the local information is complete.
- Then reorganize only the existing GitHub issues #141 and #143 and their relevant dependency references so their scope, status, and dependencies accurately represent the documented implementation work. Inspect and preserve the completed relationship facts: #140, #142, and #149 are closed/completed; #141 is a child of #137; #143 is a child of #138; and #141/#143 are currently closed/completed despite the documented remaining work.
- Do not create or close issues without a documented mapping in the requested Markdown narrative, and do not make silent GitHub changes.

## Blocking ambiguity

- Approval is required before GitHub mutations. Confirm the proposed issue mapping in the final narrative—specifically whether #141 and #143 should be reopened and retitled/re-scoped as the two remaining-work tracking issues, with their parent/dependency references updated to show #140/#142/#149 as completed inputs—or direct a different mapping.
- The happy-path product decisions are locked: teacher is required and snapshotted on the registration; accompanist is optional with an explicit “none” choice; the initial implementation allows one class per checkout; the six-week edit cutoff is enforced server-side in the Festival timezone; and verified-payment capacity allocation remains Phase 3 work rather than browser-return or Phase 2 checkout work. The baseline #141 requirement for a positive performance-minutes value applies to the selected duration. No GitHub mutation is authorized until the issue mapping receives explicit approval.

## Assumptions

- The supplied research remains the authoritative baseline and is preserved verbatim in `tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`; the user's later happy path is approved Phase 2 planning scope and will be explicitly mapped to #141 rather than silently reinterpreting that baseline.
- This task is limited to planning documentation and GitHub issue organization. It authorizes no product-code, test, Shopify, or live Festival configuration changes.
- The requested narrative will use the exact filename `Phase-2-Class-Purchase-Entitlement.md` at the repository root; this is a file-placement convention, not an expansion of the research scope.
- The approved order is: authenticate/add child as a prerequisite, choose child/division/teacher/class, complete required Festival information, start a direct Shopify checkout for that class, then rely on verified paid-order processing—not a browser return—to create the entitlement. Division stays disabled until a child is selected, and teacher stays disabled until the child and division are selected. Teacher is required and snapshotted on the registration.
- Festival information consists of musical piece title, composer, movements, an optional accompanist with an explicit “none” choice, and positive performance duration. It is customer-owned, separate from the entitlement, and editable only before the server-side cutoff timestamp calculated as six weeks before Festival start in the Festival timezone; edits at or after that timestamp are rejected. Permitted edits never change the purchased class, price, capacity/waitlist position, or entitlement.
- A different child or another class for the same child starts an independent purchase flow. The initial implementation permits exactly one class per Shopify checkout. Verified-payment capacity/waitlist allocation is a Phase 3 dependency and is not performed on checkout return.
- The default proposed mapping is to retain #141 as the catalog/product/checkout/capacity work item and #143 as the age-snapshot work item dependent on the completed catalog work, because that preserves the supplied research numbering and the existing #141 → #143 dependency. This is a proposal, not an approved mutation.
- #140, #142, and #149 remain closed/completed reference dependencies; #137 and #138 remain the recorded parents of #141 and #143 unless the approved narrative explicitly documents a different relationship.

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

## Next action

- Request explicit approval of the proposed issue mapping. Until that approval is supplied, do not write the requested Phase 2 narrative or mutate GitHub issues.
