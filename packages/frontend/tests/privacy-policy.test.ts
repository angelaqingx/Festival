import { describe, expect, it } from "bun:test";

const policy = await Bun.file(
	new URL("../src/pages/PrivacyPolicyPage.tsx", import.meta.url),
).text();

// JSX line breaks split sentences across lines, so compare on single spaces.
const text = policy.replace(/\s+/g, " ");

describe("privacy policy", () => {
	it("discloses usage metrics used for performance and capacity planning", () => {
		expect(text).toContain("<h2>Usage metrics</h2>");
		expect(text).toContain("monitor performance and plan capacity");
		expect(text).toContain("We do not use it for advertising");
	});

	it("describes the public directory and what it never shows", () => {
		expect(text).toContain("<h2>Public teacher and accompanist directory</h2>");
		expect(text).toContain(
			"never shows your email address, phone number, or mailing address",
		);
		expect(text).toContain("Listing is optional");
	});

	it("explains staff access to contact details and the audit record", () => {
		expect(text).toContain("Festival staff who manage memberships");
		expect(text).toContain(
			"The record does not include the contact details themselves",
		);
	});
});
