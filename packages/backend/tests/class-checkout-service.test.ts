import { describe, expect, it } from "bun:test";
import {
	ClassCheckoutService,
	type StartClassCheckoutInput,
} from "../src/checkout/class-checkout-service.js";
import type { FestivalRecord } from "@festival/common";
import { InMemoryCheckoutRepository } from "../src/checkout/checkout-repository.js";
import { InMemoryCustomerAccountRepository } from "../src/customer/in-memory-customer-account-repository.js";
import { InMemoryOrganizationRepository } from "../src/repo/in-memory-organization-repository.js";

interface FixtureOptions {
	now?: Date;
	classMinAge?: number;
	classMaxAge?: number;
	childAge?: number;
	isClassActive?: boolean;
	snapshotValidDays?: number;
	snapshotCreatedDaysAgo?: number;
	isPrimaryFestival?: boolean;
}

async function createFixture(options: FixtureOptions = {}) {
	const now = options.now ?? new Date("2026-09-21T12:00:00.000Z");
	const nowFn = () => now;

	const organizations = new InMemoryOrganizationRepository();
	const customers = new InMemoryCustomerAccountRepository();
	const checkout = new InMemoryCheckoutRepository();

	const organization = await organizations.createOrganization({
		name: "Pacific Northwest Music Festival",
		slug: "pnw-festival",
	});

	const division = await organizations.createDivision({
		organizationId: organization.id,
		displayName: "Junior Piano",
		normalizedName: "junior piano",
	});

	const subtype = await organizations.createRegistrationCatalogValue({
		organizationId: organization.id,
		kind: "class_subtype",
		displayName: "Solo Piano",
		normalizedName: "solo piano",
	});

	let festival: FestivalRecord | undefined;
	let classConfig: { id: string } = { id: "dummy-class-id" };

	if (options.isPrimaryFestival !== false) {
		festival = await organizations.createFestival({
			id: "fest-2026",
			organizationId: organization.id,
			code: "PNW2026",
			shortName: "pnw2026",
			name: "PNW Festival 2026",
			startDate: "2026-11-01",
			endDate: "2026-11-10",
		});
		await organizations.setPrimaryFestival(organization.id, festival.id);

		classConfig = await organizations.createFestivalClassConfiguration({
			organizationId: organization.id,
			festivalId: festival.id,
			displayName: "Junior Solo Piano Level 1",
			classSubtypeId: subtype.id,
			divisionId: division.id,
			minimumAge: options.classMinAge ?? 8,
			maximumAge: options.classMaxAge ?? 12,
			price: "45.00",
			maximumPerformancePieces: 2,
			performanceMinutes: 10,
			capacity: 25,
			isActive: options.isClassActive !== false,
			shopifyProductGid: "gid://shopify/Product/100",
			shopifyVariantGid: "gid://shopify/ProductVariant/200",
		});
	}

	const { customer, session } = await customers.createCustomerSession({
		sessionId: "session-test-parent-1",
		organizationId: organization.id,
		shopifyCustomerGid: "gid://shopify/Customer/999",
		encryptedTokens: "encrypted-token-test",
		csrfToken: "csrf-token-12345",
		integrationVersion: 1,
		createdAtIso: now.toISOString(),
		lastSeenAtIso: now.toISOString(),
		expiresAtIso: new Date(now.getTime() + 8 * 3600_000).toISOString(),
	});

	const child = await customers.createChild({
		organizationId: organization.id,
		parentCustomerId: customer.id,
		displayName: "Alice Smith",
	});

	const snapshotCreatedDaysAgo = options.snapshotCreatedDaysAgo ?? 0;
	const snapshotCreatedAt = new Date(
		now.getTime() - snapshotCreatedDaysAgo * 24 * 3600_000,
	);
	const snapshotValidDays = options.snapshotValidDays ?? 90;
	const validUntilIso = new Date(
		snapshotCreatedAt.getTime() + snapshotValidDays * 24 * 3600_000,
	).toISOString();

	if (options.childAge !== undefined || options.snapshotValidDays !== 0) {
		await customers.createChildAgeSnapshot({
			organizationId: organization.id,
			childId: child.id,
			age: options.childAge ?? 10,
			validUntilIso,
			createdAtIso: snapshotCreatedAt.toISOString(),
		});
	}

	const service = new ClassCheckoutService(
		organizations,
		customers,
		checkout,
		nowFn,
	);

	const defaultInput: StartClassCheckoutInput = {
		organizationId: organization.id,
		customerId: customer.id,
		sessionId: session.sessionId,
		idempotencyKey: "11111111-2222-3333-4444-555555555555",
		festivalClassId: classConfig.id,
		childId: child.id,
		currency: "USD",
	};

	return {
		organizations,
		customers,
		checkout,
		organization,
		festival,
		classConfig,
		customer,
		session,
		child,
		service,
		defaultInput,
		now,
	};
}

describe("ClassCheckoutService", () => {
	it("successfully creates a checkout intent for a valid parent and eligible child", async () => {
		const f = await createFixture({
			classMinAge: 8,
			classMaxAge: 12,
			childAge: 10,
		});

		const result = await f.service.start(f.defaultInput);

		expect(result).toBeDefined();
		expect(result.correlationId).toBeDefined();
		expect(result.intent).toBeDefined();
		expect(result.intent.correlationId).toBe(result.correlationId);
		expect(result.intent.intentType).toBe("class_entry");
		expect(result.intent.festivalClassId).toBe(f.classConfig.id);
		expect(result.intent.childId).toBe(f.child.id);
		expect(result.intent.shopifyProductGid).toBe("gid://shopify/Product/100");
		expect(result.intent.shopifyVariantGid).toBe("gid://shopify/ProductVariant/200");
		expect(result.intent.amount).toBe("45.00");
		expect(result.intent.currencyCode).toBe("USD");
		expect(result.intent.organizationId).toBe(f.organization.id);
		expect(result.intent.customerId).toBe(f.customer.id);
		expect(result.intent.status).toBe("creating");

		// Stored in checkout repository and findable by correlationId
		const stored = await f.checkout.findIntentByCorrelation(
			f.organization.id,
			result.correlationId,
		);
		expect(stored).toBeDefined();
		expect(stored?.id).toBe(result.intent.id);
		expect(stored?.intentType).toBe("class_entry");
		expect(stored?.festivalClassId).toBe(f.classConfig.id);
		expect(stored?.childId).toBe(f.child.id);
	});

	it("handles exact boundary ages for minimum_age and maximum_age", async () => {
		// Minimum age boundary
		const fMin = await createFixture({
			classMinAge: 8,
			classMaxAge: 12,
			childAge: 8,
		});
		const resultMin = await fMin.service.start(fMin.defaultInput);
		expect(resultMin.intent.festivalClassId).toBe(fMin.classConfig.id);

		// Maximum age boundary
		const fMax = await createFixture({
			classMinAge: 8,
			classMaxAge: 12,
			childAge: 12,
		});
		const resultMax = await fMax.service.start(fMax.defaultInput);
		expect(resultMax.intent.festivalClassId).toBe(fMax.classConfig.id);
	});

	it("fails when customer session is invalid or revoked", async () => {
		const f = await createFixture();

		// Invalid session ID
		await expect(
			f.service.start({
				...f.defaultInput,
				sessionId: "non-existent-session",
			}),
		).rejects.toMatchObject({
			status: 401,
		});

		// Revoked session
		await f.customers.revokeSession(f.session.sessionId, f.now.toISOString());
		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 401,
		});
	});

	it("fails when customer session is expired", async () => {
		const now = new Date("2026-09-21T12:00:00.000Z");
		const f = await createFixture({ now });

		// Fast forward 10 hours beyond session expiry
		const laterNow = new Date(now.getTime() + 10 * 3600_000);
		const laterService = new ClassCheckoutService(
			f.organizations,
			f.customers,
			f.checkout,
			() => laterNow,
		);

		await expect(laterService.start(f.defaultInput)).rejects.toMatchObject({
			status: 401,
		});
	});

	it("fails when child does not belong to parent customer", async () => {
		const f = await createFixture();

		// Create another parent customer and child
		const { customer: otherParent } = await f.customers.createCustomerSession({
			sessionId: "session-other-parent",
			organizationId: f.organization.id,
			shopifyCustomerGid: "gid://shopify/Customer/888",
			encryptedTokens: "encrypted",
			csrfToken: "csrf",
			integrationVersion: 1,
			createdAtIso: f.now.toISOString(),
			lastSeenAtIso: f.now.toISOString(),
			expiresAtIso: new Date(f.now.getTime() + 3600_000).toISOString(),
		});

		const otherChild = await f.customers.createChild({
			organizationId: f.organization.id,
			parentCustomerId: otherParent.id,
			displayName: "Bob Jones",
		});

		// Attempting to register otherParent's child with parent 1 session
		await expect(
			f.service.start({
				...f.defaultInput,
				childId: otherChild.id,
			}),
		).rejects.toMatchObject({
			status: 404,
		});
	});

	it("fails when child has no age snapshot", async () => {
		const f = await createFixture({ childAge: undefined, snapshotValidDays: 0 });

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when child age snapshot is expired", async () => {
		// Valid until was in the past (e.g. -1 day)
		const f = await createFixture({
			snapshotValidDays: -1,
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when child age snapshot exceeds 90 days validity window", async () => {
		// Snapshot created 95 days ago
		const f = await createFixture({
			snapshotCreatedDaysAgo: 95,
			snapshotValidDays: 120, // validUntil is future, but snapshot was created > 90 days ago
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when child age is below minimum age requirement", async () => {
		const f = await createFixture({
			classMinAge: 8,
			classMaxAge: 12,
			childAge: 7,
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when child age exceeds maximum age requirement", async () => {
		const f = await createFixture({
			classMinAge: 8,
			classMaxAge: 12,
			childAge: 13,
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when festival class configuration is inactive", async () => {
		const f = await createFixture({
			isClassActive: false,
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 400,
		});
	});

	it("fails when festival class configuration does not exist", async () => {
		const f = await createFixture();

		await expect(
			f.service.start({
				...f.defaultInput,
				festivalClassId: "non-existent-class-id",
			}),
		).rejects.toMatchObject({
			status: 404,
		});
	});

	it("fails when active festival is not configured", async () => {
		const f = await createFixture({
			isPrimaryFestival: false,
		});

		await expect(f.service.start(f.defaultInput)).rejects.toMatchObject({
			status: 404,
		});
	});

	it("prevents multiple concurrent checkouts in progress", async () => {
		const f = await createFixture();

		// Start first checkout
		await f.service.start(f.defaultInput);

		// Attempting another checkout with a different idempotency key while the first is in progress
		await expect(
			f.service.start({
				...f.defaultInput,
				idempotencyKey: "99999999-8888-7777-6666-555555555555",
			}),
		).rejects.toMatchObject({
			status: 409,
			code: "checkout_in_progress",
		});
	});
});
