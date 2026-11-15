import { describe, expect, it } from "bun:test";
import type { CustomerSessionResponse } from "@festival/common";
import { createEffect, createRoot, createSignal, untrack } from "solid-js";
import { createCustomerIdentityState } from "../src/domains/customer/CustomerIdentityContext.js";
import {
	createParentRegistrationState,
	type ParentRegistrationWorkspace,
} from "../src/lib/parent-registration-state.js";
import type { AppRoute } from "../src/lib/routes.js";

const slug = "draft-session-test";
const otherSlug = "other-draft-session-test";
const festivalSlug = "spring";
const entry = {
	childId: "performer-1",
	childName: "Sample Performer",
	divisionId: "piano",
	divisionName: "Piano",
	teacherId: "teacher-1",
	teacherName: "Sample Teacher",
	classId: "solo",
	className: "Solo",
	priceCents: 4500,
	pieces: [{ title: "Minuet", composer: "Bach", durationSeconds: 90 }],
};

function authenticated(
	csrfToken: string,
	expiresAtIso = "2027-01-01T00:00:00.000Z",
): CustomerSessionResponse {
	return { session: { authenticated: true, csrfToken, expiresAtIso } };
}

const anonymous = { session: { authenticated: false } } as const;

function addDraft(workspace: ParentRegistrationWorkspace) {
	workspace.setChildId(entry.childId);
	workspace.setDivisionId(entry.divisionId);
	workspace.setTeacherId(entry.teacherId);
	workspace.cart.addItem(entry);
	return workspace.cart.beginCheckout();
}

function readDraft(workspace: ParentRegistrationWorkspace) {
	return {
		cartCount: workspace.cart.itemCount(),
		childId: workspace.childId(),
		divisionId: workspace.divisionId(),
		teacherId: workspace.teacherId(),
		checkout: workspace.cart.checkoutSubmission(),
	};
}

const emptyDraft = {
	cartCount: 0,
	childId: "",
	divisionId: "",
	teacherId: "",
	checkout: null,
};

function mountCustomerIdentity() {
	return createRoot((dispose) => {
		const parentRegistration = createParentRegistrationState();
		const workspace = parentRegistration.workspace(slug, festivalSlug);
		const otherWorkspace = parentRegistration.workspace(
			otherSlug,
			festivalSlug,
		);
		const [route, setRoute] = createSignal<AppRoute>({
			kind: "org-root",
			slug,
		});
		const requests: ReturnType<
			typeof Promise.withResolvers<CustomerSessionResponse>
		>[] = [];
		const identity = createCustomerIdentityState(
			{ route, parentRegistration },
			() => {
				const request = Promise.withResolvers<CustomerSessionResponse>();
				requests.push(request);
				return request.promise;
			},
		);
		const observed: Array<{
			csrfToken: string;
			draft: ReturnType<typeof readDraft>;
		}> = [];
		createEffect(() => {
			const session = identity.customerSession();
			if (session.authenticated) {
				observed.push({
					csrfToken: session.csrfToken,
					draft: untrack(() => readDraft(workspace)),
				});
			}
		});
		return {
			...identity,
			setRoute,
			requests,
			workspace,
			otherWorkspace,
			observed,
			dispose,
		};
	});
}

describe("customer session registration drafts", () => {
	it("preserves a same-session refresh and clears the draft before publishing a replacement session", async () => {
		const view = mountCustomerIdentity();
		try {
			view.requests[0].resolve(authenticated("session-a"));
			await Bun.sleep(0);
			expect(view.customerSession().authenticated).toBe(true);
			const checkout = addDraft(view.workspace);
			addDraft(view.otherWorkspace);
			const existingDraft = readDraft(view.workspace);
			const otherDraft = readDraft(view.otherWorkspace);

			const refreshed = authenticated("session-a", "2027-01-02T00:00:00.000Z");
			const refresh = view.refreshCustomerSession();
			view.requests[1].resolve(refreshed);
			await refresh;
			expect(view.customerSession()).toEqual(refreshed.session);
			expect(readDraft(view.workspace)).toEqual(existingDraft);
			expect(view.workspace.cart.getCheckoutIdempotencyKey()).toBe(
				checkout.idempotencyKey,
			);

			view.setRoute({ kind: "festival-cart", slug, festivalSlug });
			view.requests[2].resolve(authenticated("session-b"));
			await Bun.sleep(0);
			expect(view.observed.at(-1)).toEqual({
				csrfToken: "session-b",
				draft: emptyDraft,
			});
			expect(readDraft(view.workspace)).toEqual(emptyDraft);
			expect(readDraft(view.otherWorkspace)).toEqual(otherDraft);
			expect(addDraft(view.workspace).idempotencyKey).not.toBe(
				checkout.idempotencyKey,
			);
		} finally {
			view.dispose();
		}
	});

	it("clears on a confirmed anonymous session and ignores stale or failed reads", async () => {
		const view = mountCustomerIdentity();
		try {
			view.requests[0].resolve(authenticated("session-a"));
			await Bun.sleep(0);
			addDraft(view.workspace);
			const existingDraft = readDraft(view.workspace);

			view.setRoute({ kind: "festival-cart", slug, festivalSlug });
			const refresh = view.refreshCustomerSession();
			view.requests[2].resolve(authenticated("session-a"));
			await refresh;
			view.requests[1].resolve(anonymous);
			await Bun.sleep(0);
			expect(readDraft(view.workspace)).toEqual(existingDraft);
			expect(view.customerSession()).toEqual(
				authenticated("session-a").session,
			);

			const unavailable = view.refreshCustomerSession();
			view.requests[3].reject(new Error("Connection lost"));
			await unavailable;
			expect(readDraft(view.workspace)).toEqual(existingDraft);

			const signedOut = view.refreshCustomerSession();
			view.requests[4].resolve(anonymous);
			await signedOut;
			expect(readDraft(view.workspace)).toEqual(emptyDraft);
			expect(view.customerSession()).toEqual(anonymous.session);
		} finally {
			view.dispose();
		}
	});
});
