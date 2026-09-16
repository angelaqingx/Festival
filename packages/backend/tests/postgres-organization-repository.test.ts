import { describe, expect, it } from "bun:test";

async function source() {
	return Bun.file(
		new URL("../src/repo/postgres-organization-repository.ts", import.meta.url),
	).text();
}

describe("PostgresOrganizationRepository", () => {
	it("binds every festival column and makes the first festival primary", async () => {
		const value = await source();
		const createFestival = value.slice(
			value.indexOf("async createFestival("),
			value.indexOf("async findFestivalByName("),
		);

		expect(createFestival).toContain("is_primary,");
		expect(createFestival).toContain("NOT EXISTS (");
		expect(createFestival).toContain("WHERE organization_id = $2");
		expect(createFestival).toContain("$5,\n\t\t\t\t\t$6,\n\t\t\t\t\t$7");
	});

	it("does not add festival values to the invite insert", async () => {
		const value = await source();
		const createInvite = value.slice(
			value.indexOf("async createInvite("),
			value.indexOf("async findInviteByToken("),
		);

		expect(createInvite).toContain("VALUES ($1, $2, $3, $4, $5, $6)");
		expect(createInvite).not.toContain("is_primary");
	});

	it("retries accompanist cohort contention and returns a typed conflict", async () => {
		const value = await source();
		const createGrant = value.slice(
			value.indexOf("async createAccompanistMembershipGrant("),
			value.indexOf("async listAccompanistMembershipGrants("),
		);

		expect(createGrant).toContain("attempt < 2");
		expect(createGrant).toContain("AccompanistMembershipCohortContentionError");
		expect(createGrant).toContain("attempt === 0");
		expect(createGrant).toContain("new AccompanistMembershipConflictError()");
		expect(value).toContain("unique|duplicate|exclusion");
	});
});
