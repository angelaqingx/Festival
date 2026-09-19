import { afterEach, describe, expect, it } from "bun:test";
import {
	getAdminRegistrationConfiguration,
	getAdminTimezone,
	updateAdminRegistrationAgeDate,
	updateAdminTimezone,
} from "../src/lib/api.js";

let fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
const originalFetch = globalThis.fetch;

function mockFetch() {
	fetchCalls = [];
	globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) => {
		const requestUrl =
			typeof url === "string"
				? url
				: url instanceof URL
					? url.toString()
					: url.url;
		fetchCalls.push({ url: requestUrl, init });
		return Promise.resolve(
			new Response(JSON.stringify({ timezone: "UTC" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
	}) as typeof fetch;
}

afterEach(() => {
	fetchCalls = [];
	globalThis.fetch = originalFetch;
});

describe("Admin settings frontend contract", () => {
	it("loads and saves tenant-admin timezone and registration cutoff settings", async () => {
		mockFetch();
		await getAdminTimezone("token", "pafe");
		await getAdminRegistrationConfiguration("token", "pafe");
		await updateAdminTimezone("token", "pafe", {
			timezone: "America/Los_Angeles",
		});
		await updateAdminRegistrationAgeDate("token", "pafe", "2027-01-01");

		expect(fetchCalls.map((call) => call.url)).toEqual([
			"/api/organizations/pafe/admin/timezone",
			"/api/organizations/pafe/admin/registration-configuration",
			"/api/organizations/pafe/admin/timezone",
			"/api/organizations/pafe/admin/registration-age-date",
		]);
		expect(fetchCalls.slice(2).map((call) => call.init?.body)).toEqual([
			JSON.stringify({ timezone: "America/Los_Angeles" }),
			JSON.stringify({ registrationAgeDate: "2027-01-01" }),
		]);
	});

	it("renders the organization settings page with a date picker and context", async () => {
		const page = await Bun.file("src/pages/AdminSettingsPage.tsx").text();
		const home = await Bun.file("src/pages/AdminHomePage.tsx").text();
		const divisions = await Bun.file("src/pages/AdminDivisionsPage.tsx").text();

		expect(home).toContain("Organization Wide Settings");
		expect(page).toContain('type="date"');
		expect(page).toContain("A registrant’s age is calculated as of this date");
		expect(page).toContain("Save registration age cutoff");
		expect(page).toContain("Organization timezone");
		expect(divisions).not.toContain("Organization timezone");
	});
});
