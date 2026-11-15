import type { CustomerSessionResponse } from "@festival/common";
import {
	batch,
	createContext,
	createEffect,
	createSignal,
	on,
	onCleanup,
	type ParentProps,
	useContext,
} from "solid-js";
import { useFestivalShell } from "../../app/FestivalShellContext.js";
import type { FestivalAppController } from "../../app/useFestivalAppController.js";
import { getCustomerSession } from "../../lib/api.js";
import { isOrganizationPageRoute } from "../../lib/routes.js";

export type CustomerSession = CustomerSessionResponse["session"];

export function createCustomerIdentityState(
	shell: Pick<FestivalAppController, "route" | "parentRegistration">,
	fetchSession = getCustomerSession,
) {
	const unauthenticated: CustomerSession = { authenticated: false };
	const [customerSession, setCustomerSession] =
		createSignal<CustomerSession>(unauthenticated);
	const [isCustomerSessionLoading, setIsCustomerSessionLoading] =
		createSignal(false);
	let latestRequest = 0;
	let disposed = false;

	async function refreshCustomerSession(
		slugOverride?: string,
	): Promise<CustomerSession> {
		const route = shell.route();
		const targetSlug =
			isOrganizationPageRoute(route) && "slug" in route ? route.slug : null;
		if (
			disposed ||
			(slugOverride !== undefined && slugOverride !== targetSlug)
		) {
			return unauthenticated;
		}
		const request = ++latestRequest;
		if (!targetSlug) {
			batch(() => {
				setCustomerSession(unauthenticated);
				setIsCustomerSessionLoading(false);
			});
			return unauthenticated;
		}

		const isCurrentRequest = () =>
			!disposed && request === latestRequest && shell.route() === route;
		setIsCustomerSessionLoading(true);
		try {
			const { session } = await fetchSession(targetSlug);
			if (!isCurrentRequest()) return unauthenticated;
			batch(() => {
				if (session.authenticated) {
					shell.parentRegistration.bindSession(targetSlug, session.csrfToken);
				} else {
					shell.parentRegistration.clear(targetSlug);
				}
				setCustomerSession(session);
			});
			return session;
		} catch {
			if (isCurrentRequest()) setCustomerSession(unauthenticated);
			return unauthenticated;
		} finally {
			if (isCurrentRequest()) setIsCustomerSessionLoading(false);
		}
	}

	createEffect(
		on(shell.route, () => {
			batch(() => {
				setCustomerSession(unauthenticated);
				void refreshCustomerSession();
			});
		}),
	);
	onCleanup(() => {
		disposed = true;
	});

	return {
		customerSession,
		isCustomerSessionLoading,
		refreshCustomerSession,
	};
}

export type CustomerIdentityContextValue = ReturnType<
	typeof createCustomerIdentityState
>;

const CustomerIdentityContext = createContext<CustomerIdentityContextValue>();

export function CustomerIdentityProvider(props: ParentProps) {
	const value = createCustomerIdentityState(useFestivalShell());
	return (
		<CustomerIdentityContext.Provider value={value}>
			{props.children}
		</CustomerIdentityContext.Provider>
	);
}

export function useOptionalCustomerIdentity():
	| CustomerIdentityContextValue
	| undefined {
	return useContext(CustomerIdentityContext);
}

export function useCustomerIdentity(): CustomerIdentityContextValue {
	const context = useContext(CustomerIdentityContext);
	if (!context) {
		throw new Error(
			"useCustomerIdentity must be used within a CustomerIdentityProvider.",
		);
	}
	return context;
}
