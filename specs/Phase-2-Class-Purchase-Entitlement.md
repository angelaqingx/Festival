# Phase 2: Class Purchase Entitlement

## Purpose and boundary

Phase 2 lets a parent purchase one Festival class registration at a time after
the Festival has supplied the catalog and the parent has supplied the required
Festival-owned registration information. Shopify is authoritative for payment;
Festival is authoritative for the catalog, eligibility, registration metadata,
and the resulting entitlement record.

This is a planning and issue-organization artifact. It does not authorize
product implementation. The source research is preserved verbatim in
`tasks/phase-2-class-purchase-entitlement/partially-completed-issues-research.md`.

## Simplest happy path

1. A Festival Admin creates a Festival-scoped Solo class, for example Spring
   Festival / Cello-Bass / ages 8 through 10. The class has an active,
   same-tenant division and subtype, inclusive minimum and maximum ages, price,
   capacity, performance limits, and the required Festival context.
2. The class receives one digital, no-shipping Shopify product and one trusted
   variant. Festival reads it back and audits the association.
3. A Shopify-authenticated parent adds a child. Festival derives an age
   snapshot using the configured registration-age date and discards the
   birthday.
4. On one progressive entry-selection screen, the parent selects a child;
   Division is then enabled. After both child and division are selected,
   Teacher is enabled and must be selected. Festival snapshots the selected
   teacher on the registration and shows only active, Festival-, division-, and
   age-eligible classes.
5. After choosing a class, the parent completes Festival information: musical
   piece title, composer, movements, positive duration, and an optional
   accompanist with an explicit **None** option. Festival owns this draft.
6. Only a complete draft may create checkout. Festival creates one direct
   Shopify checkout for that one class and sends the parent to Shopify payment.
7. A browser return is only a processing state. Verified paid-order processing,
   not the browser, creates the entitlement. Capacity allocation is explicitly
   deferred to Phase 3's verified-payment workflow.
8. The parent may start a separate flow for another child or another class for
   the same child. The initial implementation has one class per checkout.
9. The parent may edit Festival information only before the server-enforced
   cutoff at Festival start minus six weeks in the Festival timezone. At or
   after that timestamp, edits are rejected. Valid edits never change the
   entitlement, paid price, selected class, or later allocation outcome.

## Work breakdown

### #141 — catalog, product lifecycle, and direct checkout

Reopen and re-scope #141 to own the following Phase 2 work:

- Festival-scoped Admin create, list, edit, deactivate, and reactivate APIs and
  UI. Festival, division, and subtype remain immutable; only title, optional
  description, price, capacity, and active state are editable.
- Validation of the configured registration-age date, active same-tenant
  division/subtype, non-negative decimal shop-currency price, default capacity
  100, and positive performance minutes.
- Shopify class product lifecycle: one digital/no-shipping product and trusted
  single variant, readback/audit, immediate price propagation, and
  non-destructive deactivation.
- The locked parent flow through selection, complete Festival metadata, and one
  direct Shopify checkout. A deactivated class blocks new selection and
  checkout.
- The local metadata draft and its teacher snapshot, required information gate,
  explicit no-accompanist choice, Festival-timezone edit cutoff, and independent
  repeat purchases.
- API, service, UI, Shopify, and catalog/checkout integration coverage.

Capacity allocation is **not** Phase 2 checkout work. The requirement for a
concurrency-safe soft-capacity/waitlist outcome is a dependency on
[#28](https://github.com/pafenorthwest/Festival/issues/28): it occurs only
after verified payment, never on checkout return.

### #143 — hard age-snapshot invariant

Reopen and narrow #143 to selection enforcement after the #141 catalog is
available:

- Reject an age snapshot whenever the server time is at or after its 90-day
  `valid_until` boundary; the parent must refresh it without Festival retaining
  a birthday.
- Cover the stale-but-future-valid case: even if the stored age would otherwise
  qualify for a class at a future point, an expired snapshot may not select a
  teacher or class or begin checkout.
- Preserve tenant/session isolation, active/eligible catalog filtering, and
  DTO redaction. #143 does not own catalog administration or checkout metadata.

## Issue mapping and approved actions

| Issue | Current relationship/status | Approved treatment | Reason |
| --- | --- | --- | --- |
| [#137](https://github.com/pafenorthwest/Festival/issues/137) | Open parent of #141 | No change | Retains the Festival class-catalog parent relationship. |
| [#138](https://github.com/pafenorthwest/Festival/issues/138) | Open parent of #143 | No change | Retains the authenticated family workflow parent relationship. |
| [#140](https://github.com/pafenorthwest/Festival/issues/140) | Closed prerequisite | No change | Provides the registration-age date and catalog vocabularies. |
| [#141](https://github.com/pafenorthwest/Festival/issues/141) | Closed child of #137 despite remaining work | Reopen, retitle/re-scope, and add clarification comment | Owns the remaining catalog/product/direct-checkout work and the locked metadata path. |
| [#142](https://github.com/pafenorthwest/Festival/issues/142) | Closed prerequisite | No change | Provides privacy-safe parent/child records and the 90-day snapshot foundation. |
| [#143](https://github.com/pafenorthwest/Festival/issues/143) | Closed child of #138 despite remaining work | Reopen, retitle/narrow, and add clarification comment | Owns the hard selection-time snapshot invariant after #141. |
| [#149](https://github.com/pafenorthwest/Festival/issues/149) | Closed prerequisite | No change | Provides canonical Festival URLs and Festival Admin context. |

No issue is created or closed. #141 remains under #137, #143 remains under
#138, and the existing #141-to-#143 dependency is retained. Closed #140, #142,
and #149 are satisfied inputs, not new work.

## Verification for this organization change

- Confirm this document retains every supplied remaining-work item and makes
  Phase 3 allocation explicit.
- Re-read #141 and #143 after mutation to confirm their open state, updated
  scopes, comments, parentage, and dependency relationship.
- Confirm #140, #142, and #149 remain closed; #137 and #138 remain unchanged;
  and no issue was created or closed.
