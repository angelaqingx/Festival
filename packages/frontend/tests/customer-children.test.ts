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
		expect(page).toContain("nameFieldsStacked");
		expect(page).toContain("customer-children-name-layout-toggle");
		expect(page).toContain("Show name fields one per row");
		expect(styles).toContain(".customer-children-form");
		expect(styles).toContain("gap: 0.85rem;");
		expect(styles).toContain(
			"grid-template-columns: repeat(3, minmax(0, 1fr));",
		);
		expect(styles).toContain("gap: 3px;");
		expect(styles).toContain("clip-path: polygon(0 50%, 100% 0, 100% 100%);");
		expect(styles).toContain("clip-path: polygon(50% 0, 100% 100%, 0 100%);");
	});
});
