import { describe, expect, it } from "bun:test";
import { childDisplayName } from "../src/pages/CustomerChildrenPage.js";

describe("Customer children name entry", () => {
	it("stores the three name fields in the existing display-name format", () => {
		expect(childDisplayName(" Ada ", " Lovelace ", " Countess ")).toBe(
			'Ada Lovelace "Countess"',
		);
		expect(childDisplayName("Ada", "Lovelace", "   ")).toBe("Ada Lovelace");
	});

	it("uses labeled fields and standard form gutters", async () => {
		const page = await Bun.file("src/pages/CustomerChildrenPage.tsx").text();
		const styles = await Bun.file("src/styles.css").text();

		expect(page).toContain("First Name");
		expect(page).toContain("Family Name");
		expect(page).toContain("Nick Name");
		expect(page).toContain("customer-children-name-optional");
		expect(page).toContain("customer-child-status");
		expect(styles).toContain(".customer-children-form");
		expect(styles).toContain("gap: 0.85rem;");
	});
});
