import {
	deriveEntitlementLifecycle,
	type EntitlementLifecycleState,
} from "@festival/common";

type LifecycleReadableEntitlement = {
	startsOn: string;
	endsOn: string;
	status?: string;
};

/**
 * Derives lifecycle for a repository read while honoring the immutable
 * revocation result included by legacy read DTOs.
 */
export function lifecycleForEntitlementRead(
	entitlement: LifecycleReadableEntitlement,
	today: string,
): EntitlementLifecycleState {
	if (entitlement.status === "revoked") return "revoked";
	return deriveEntitlementLifecycle(entitlement, today);
}
