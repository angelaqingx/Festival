export type CustomerSessionGateResult<
	Session extends { session: { authenticated: boolean } },
	ProtectedData,
> =
	| { authenticated: false; session: Session }
	| { authenticated: true; session: Session; protectedData: ProtectedData };

export async function loadAfterCustomerSession<
	Session extends { session: { authenticated: boolean } },
	ProtectedData,
>(
	loadSession: () => Promise<Session>,
	loadProtectedData: () => Promise<ProtectedData>,
): Promise<CustomerSessionGateResult<Session, ProtectedData>> {
	const session = await loadSession();
	if (!session.session.authenticated) {
		return { authenticated: false, session };
	}

	return {
		authenticated: true,
		session,
		protectedData: await loadProtectedData(),
	};
}
