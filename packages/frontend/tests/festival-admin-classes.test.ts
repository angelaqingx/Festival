import { describe, expect, it } from "bun:test";

const dashboard = await Bun.file(
	new URL("../src/pages/FestivalAdminDashboardPage.tsx", import.meta.url),
).text();
const classesPage = await Bun.file(
	new URL("../src/pages/FestivalAdminClassesPage.tsx", import.meta.url),
).text();
const app = await Bun.file(new URL("../src/App.tsx", import.meta.url)).text();

describe("Festival Admin Classes entry point", () => {
	it("links the verified Festival dashboard to its Classes page", () => {
		expect(dashboard).toContain("buildFestivalAdminClassesPath");
		expect(dashboard).toContain("Manage this Festival’s class catalog.");
	});

	it("re-verifies the Festival context before rendering the Classes page", () => {
		expect(classesPage).toContain("getAdminFestival");
		expect(classesPage).toContain(
			"Only Admin members can manage festival classes.",
		);
		expect(classesPage).toContain("Festival not found.");
		expect(app).toContain('app.route().kind === "festival-admin-classes"');
	});
});
