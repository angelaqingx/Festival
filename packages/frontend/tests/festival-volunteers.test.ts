import { afterEach, describe, expect, it } from "bun:test";
import { buildEmailLinkUrl } from "../src/lib/firebase-auth.js";

const read = (path: string) => Bun.file(new URL(path, import.meta.url)).text();

const originalWindow = (globalThis as { window?: unknown }).window;
afterEach(() => {
	(globalThis as { window?: unknown }).window = originalWindow;
});

describe("volunteer sign-in flow", () => {
	it("returns volunteers to their festival page from the email link, not create-organization", () => {
		(globalThis as { window?: unknown }).window = {
			location: { origin: "https://festival.example" },
		};

		expect(
			buildEmailLinkUrl({
				kind: "volunteer",
				slug: "pafe",
				festivalSlug: "spring",
			}),
		).toBe("https://festival.example/org/pafe/festival/spring/volunteers");
		expect(buildEmailLinkUrl({ kind: "create-org" })).toBe(
			"https://festival.example/create-organization",
		);
		expect(
			buildEmailLinkUrl({ kind: "invite", inviteToken: "t", name: "N" }),
		).toBe("https://festival.example/invite/t");
	});

	it("remembers the festival before sign-in and navigates back instead of creating an organization", async () => {
		const actions = await read("../src/app/createFestivalActions.ts");
		const lifecycle = await read("../src/app/useFestivalLifecycle.ts");

		expect(actions).toContain('kind: "volunteer" as const');
		expect(actions).toContain("route.festivalSlug");
		expect(actions).toContain(
			"Volunteer sign-in must start from a festival page.",
		);
		expect(lifecycle).toContain('intent?.kind === "volunteer"');
		expect(lifecycle.indexOf('intent?.kind === "volunteer"')).toBeLessThan(
			lifecycle.indexOf('intent?.kind === "create-org"'),
		);
		expect(lifecycle).toContain("buildFestivalVolunteersPath");
	});

	it("shows a public volunteer page that verifies the festival and offers sign-in", async () => {
		const page = await read("../src/pages/FestivalVolunteersPage.tsx");
		const app = await read("../src/App.tsx");

		expect(page).toContain("getPublicFestival");
		expect(page).toContain("Festival not found.");
		expect(page).toContain('festival.state === "errored"');
		expect(page).toContain('openSignInModal("volunteer")');
		expect(app).toContain('app.route().kind === "festival-volunteers"');
		expect(app).toContain("<FestivalVolunteersPage");
	});
});
