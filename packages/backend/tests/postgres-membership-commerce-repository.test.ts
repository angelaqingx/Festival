import { describe, expect, it } from "bun:test";

async function source() {
	return Bun.file(
		new URL(
			"../src/commerce/postgres-membership-commerce-repository.ts",
			import.meta.url,
		),
	).text();
}

describe("PostgresMembershipCommerceRepository", () => {
	it("rechecks entitlement cohorts after taking the customer finalization lock", async () => {
		const value = await source();

		expect(value).toContain("let finalDecision = input.decision;");
		expect(value).toContain(
			"membership_entitlement_cohorts SET version=version+1",
		);
		expect(value).toContain("Entitlement cohort compare-and-swap failed.");
		expect(value).toContain('reasonCode: "duplicate_purchase"');
		expect(value).toContain("grantInput = undefined;");
		expect(value).toContain("startsOn,");
	});
});
