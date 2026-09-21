import type { CustomerAccountRepository } from "../customer/customer-account-repository.js";
import { AppError } from "../errors/app-error.js";
import type { OrganizationRepository } from "../repo/organization-repository.js";
import type {
	CheckoutIntentRecord,
	CheckoutRepository,
} from "./checkout-repository.js";

export interface StartClassCheckoutInput {
	organizationId: string;
	organizationSlug?: string;
	customerId: string;
	sessionId: string;
	idempotencyKey: string;
	festivalClassId: string;
	childId: string;
	currency?: string;
	currencyCode?: string;
}

export interface ClassCheckoutResult {
	intent: CheckoutIntentRecord;
	correlationId: string;
}

const MAX_SNAPSHOT_VALIDITY_MS = 90 * 24 * 60 * 60 * 1000;

export class ClassCheckoutService {
	constructor(
		private readonly organizations: OrganizationRepository,
		private readonly customers: CustomerAccountRepository,
		private readonly checkout: CheckoutRepository,
		private readonly now: () => Date = () => new Date(),
	) {}

	async start(input: StartClassCheckoutInput): Promise<ClassCheckoutResult> {
		if (
			!input.organizationId?.trim() ||
			!input.customerId?.trim() ||
			!input.sessionId?.trim()
		) {
			throw new AppError("Customer session is invalid.", 401);
		}
		if (!input.festivalClassId?.trim()) {
			throw new AppError("Festival class ID is required.", 400);
		}
		if (!input.childId?.trim()) {
			throw new AppError("Child ID is required.", 400);
		}

		// 1. Validates parent customer auth / session
		const session = await this.customers.getSession(input.sessionId);
		const currentTime = this.now();
		if (
			!session ||
			session.revokedAtIso ||
			session.organizationId !== input.organizationId ||
			session.customerId !== input.customerId ||
			new Date(session.expiresAtIso) <= currentTime
		) {
			throw new AppError("Customer session is invalid.", 401);
		}

		const customer = await this.customers.getCustomer(
			input.organizationId,
			input.customerId,
		);
		if (
			!customer ||
			customer.shopifyCustomerGid !== session.shopifyCustomerGid
		) {
			throw new AppError("Customer session is invalid.", 401);
		}

		// 2. Check for existing checkout outcome by idempotency key
		const existing = await this.checkout.getOutcome({
			organizationId: input.organizationId,
			customerId: input.customerId,
			sessionId: input.sessionId,
			idempotencyKey: input.idempotencyKey,
		});
		if (existing) {
			if (existing.kind === "in_progress") {
				throw new AppError(
					"Checkout is already in progress.",
					409,
					"checkout_in_progress",
				);
			}
			if (existing.kind === "expired") {
				throw new AppError("Checkout has expired.", 409, "checkout_expired");
			}
			if (existing.kind === "failed") {
				throw new AppError(
					"This checkout attempt cannot continue.",
					409,
					"checkout_terminal_failure",
				);
			}
			if (existing.kind === "ready") {
				return {
					intent: existing.intent,
					correlationId: existing.intent.correlationId,
				};
			}
		}

		// 3. Verifies child belongs to parent customer
		const children = await this.customers.listChildren(
			input.organizationId,
			input.customerId,
		);
		const child = children.find((item) => item.id === input.childId);
		if (!child) {
			throw new AppError(
				"Child not found or does not belong to parent customer.",
				404,
			);
		}

		// 4. Verifies active age snapshot for child (<= 90 days validity)
		const snapshots = await this.customers.listChildAgeSnapshots(
			input.organizationId,
			input.childId,
		);
		const activeSnapshot = snapshots.find((item) => !item.supersededAtIso);
		if (!activeSnapshot) {
			throw new AppError("Child does not have an active age snapshot.", 400);
		}

		const validUntil = new Date(activeSnapshot.validUntilIso);
		const snapshotAgeMs =
			currentTime.getTime() - new Date(activeSnapshot.createdAtIso).getTime();
		if (validUntil <= currentTime || snapshotAgeMs > MAX_SNAPSHOT_VALIDITY_MS) {
			throw new AppError("Child age snapshot has expired.", 400);
		}

		// 5. Verifies class configuration exists, is active, and is tied to the active festival and organization
		const festivals = await this.organizations.listFestivals(
			input.organizationId,
		);
		const activeFestival = festivals.find((item) => item.isPrimary);
		if (!activeFestival) {
			throw new AppError("Active festival not found.", 404);
		}

		const classConfigs =
			await this.organizations.listFestivalClassConfigurations(
				input.organizationId,
				activeFestival.id,
				false,
			);
		const classConfig = classConfigs.find(
			(item) => item.id === input.festivalClassId,
		);
		if (!classConfig) {
			throw new AppError("Festival class configuration not found.", 404);
		}
		if (!classConfig.isActive) {
			throw new AppError("Festival class configuration is inactive.", 400);
		}
		if (
			classConfig.organizationId !== input.organizationId ||
			classConfig.festivalId !== activeFestival.id
		) {
			throw new AppError(
				"Festival class configuration does not belong to the active festival.",
				400,
			);
		}

		// 6. Verifies child's age meets festival_class_configurations [minimum_age, maximum_age] rules
		const childAge = activeSnapshot.age;
		if (
			childAge < classConfig.minimumAge ||
			childAge > classConfig.maximumAge
		) {
			throw new AppError(
				`Child age (${childAge}) is outside the allowed range of [${classConfig.minimumAge}, ${classConfig.maximumAge}].`,
				400,
			);
		}

		// 7. Check if checkout is already in progress
		if (
			await this.checkout.hasProcessingIntent(
				input.organizationId,
				input.customerId,
				currentTime.toISOString(),
			)
		) {
			throw new AppError(
				"Checkout is already in progress.",
				409,
				"checkout_in_progress",
			);
		}

		// 8. Creates a checkout intent with intent_type: 'class_entry'
		const expiresAtIso = new Date(
			currentTime.getTime() + 30 * 60_000,
		).toISOString();
		const currencyCode = input.currencyCode ?? input.currency ?? "USD";

		const outcome = await this.checkout.createIntent({
			organizationId: input.organizationId,
			customerId: input.customerId,
			sessionId: input.sessionId,
			idempotencyKey: input.idempotencyKey,
			intentType: "class_entry",
			festivalClassId: classConfig.id,
			childId: child.id,
			shopifyProductGid: classConfig.shopifyProductGid,
			shopifyVariantGid: classConfig.shopifyVariantGid,
			amount: classConfig.price,
			currencyCode,
			expiresAtIso,
		});

		if (outcome.kind === "in_progress") {
			throw new AppError(
				"Checkout is already in progress.",
				409,
				"checkout_in_progress",
			);
		}
		if (outcome.kind === "expired") {
			throw new AppError("Checkout has expired.", 409, "checkout_expired");
		}
		if (outcome.kind === "failed") {
			throw new AppError(
				"This checkout attempt cannot continue.",
				409,
				"checkout_terminal_failure",
			);
		}
		if (outcome.kind === "created" || outcome.kind === "ready") {
			return {
				intent: outcome.intent,
				correlationId: outcome.intent.correlationId,
			};
		}

		throw new AppError("Failed to create class checkout intent.", 500);
	}
}
