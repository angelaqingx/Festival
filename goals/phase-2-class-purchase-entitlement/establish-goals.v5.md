# Establish Goals

## Status

- Task name: phase-2-class-purchase-entitlement
- Iteration: v5
- State: locked

## Request

Using the user-approved v4 happy-path decisions, identify the minimal GitHub issue structure needed to deliver the Phase 2 narrative. Create one new parent issue that links the relevant existing work and, only if it is a true gap, one minimal new issue for the authenticated Account Classes visibility and regression-test work. Do not begin product implementation.

## Locked decisions

- The Phase 2 sequence is: authenticated parent with a child and birthday; child, division, and required teacher selection; age-eligible class selection; complete Festival information; direct single-class Shopify checkout; verified paid-order entitlement. Browser return is not payment or entitlement authority.
- Teacher is required and snapshotted. Accompanist is optional with an explicit `none` choice. Festival information is title, composer, movements, and positive duration; it is complete before checkout and editable only before the server-side Festival-timezone cutoff six weeks before Festival start. Those edits never alter an entitlement.
- A parent buys one class per checkout and may start another flow for the same or another child.
- Verified-payment capacity/waitlist allocation is Phase 3 work under #28 and is excluded from Phase 2.
- Existing #141 owns catalog, product lifecycle, checkout, and Festival metadata work; #143 owns the hard 90-day selection snapshot invariant; #144 is relevant existing Phase 2 work. #140, #142, and #149 are completed prerequisites.

## Authorized scope

1. Create exactly one open parent GitHub issue titled for the Phase 2 Class Purchase & Entitlement happy path. Its body must link #141, #143, #144, #140, #142, #149, and #28, state each item’s role, and contain a clear checklist of the linked work and dependencies.
2. Determine whether the approved Account Classes requirement is absent from the existing linked issues. If absent, create exactly one open, minimal child/work issue for it; otherwise create no additional issue.
3. If the Account Classes issue is created, scope it only to reaffirming the existing parent-facing Shopify-order visibility through automated regression tests and adding the authenticated Account → Classes sub-page. The page has an accessible graduation-hat navigation item and shows only the current tenant/customer’s purchased classes as responsive small cards with class name, child name, and canonical purchase date/time; include loading, empty, recoverable-error, accessibility, and authorization-isolation coverage.
4. Link the Account Classes issue from the parent issue. Keep it independent from #143 unless a verified issue dependency requires otherwise.
5. Read back and report the created issue URLs, open states, body links/checklists, and the resulting mapping.

## Non-goals

- Product, API, UI, database, Shopify, test, or Festival configuration implementation.
- Editing, reopening, closing, retitling, commenting on, relabeling, reparenting, or otherwise changing any existing issue, including #141, #143, #144, #140, #142, #149, and #28.
- Creating any issue other than the one parent and, only when verified as a gap, the one Account Classes issue.
- Changing the locked happy-path decisions, the one-class-per-checkout rule, the six-week edit cutoff, or the Phase 3 capacity boundary.

## Success criteria

- [G1] One open parent issue exists with a body that directly links #141, #143, #144, #140, #142, #149, and #28; it clearly separates active Phase 2 work, completed prerequisites, and the excluded Phase 3 capacity allocation.
- [G2] The parent issue supplies an auditable linked-work/dependency checklist covering every locked happy-path stage without changing the referenced issues’ native parents or content.
- [G3] A search/readback establishes whether Account Classes is already covered. If it is a gap, exactly one open issue exists with only the approved Classes visibility/test scope and is linked from the parent. If it is already covered, no duplicate is created and the parent identifies the existing issue.
- [G4] GitHub readback verifies both created issues’ URLs, titles, open states, and parent-body links/checklists; no code and no existing GitHub issue changed.

## Next action

- Create and verify the authorized GitHub issues only. No implementation work is authorized.
