#141 remaining work:
1. Implement Festival-scoped Admin class catalog create/list/edit/deactivate/reactivate APIs and UI; Festival/division/subtype immutable; add optional description; only allowed edits.
2. Enforce configured registration-age date, active same-tenant division/subtype, non-negative decimal shop-currency price, default capacity 100, and positive performance minutes.
3. Build Shopify class product lifecycle: one digital/no-shipping product and trusted single variant, readback/audit, immediate price updates, and non-destructive deactivation.
4. Wire authenticated customer class checkout and make soft capacity/waitlist behavior concurrency-safe; deactivate must block new selection/checkout.
5. Add API/service/UI/Shopify/capacity integration coverage.

#143 remaining work:
6. Enforce a hard 90-day age-snapshot invariant for selection (including stale-but-future-valid snapshot test), and retain the dependency on the completed #141 catalog.
