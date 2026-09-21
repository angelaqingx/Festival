import { createResource, createSignal, For, onCleanup, Show } from "solid-js";
import { getVolunteerRoles } from "../lib/api.js";
import { subscribeToAuthChanges } from "../lib/firebase-auth.js";

interface VolunteerRolesPageProps {
	slug: string;
}

export function VolunteerRolesPage(props: VolunteerRolesPageProps) {
	const [idToken, setIdToken] = createSignal<string | null>(null);

	const unsubscribe = subscribeToAuthChanges(async (user) => {
		setIdToken(user ? await user.getIdToken() : null);
	});
	onCleanup(unsubscribe);

	const [roles] = createResource(idToken, (token) =>
		getVolunteerRoles(token, props.slug),
	);

	return (
		<section class="panel flow-panel">
			<header class="admin-page-header">
				<div>
					<h2>Volunteer Roles</h2>
					<p>Roles volunteers can sign up for at this festival.</p>
				</div>
			</header>
			<Show when={roles.loading}>
				<p>Loading roles…</p>
			</Show>
			<Show when={roles.error}>
				<section class="banner error-banner">
					Could not load volunteer roles: {String(roles.error)}
				</section>
			</Show>
			<Show when={roles() && roles()?.length === 0}>
				<p>No volunteer roles have been created yet.</p>
			</Show>
			<ul class="volunteer-role-list">
				<For each={roles()}>
					{(role) => (
						<li class="volunteer-role-row">
							<strong>{role.slug}</strong>
							<span>{role.description}</span>
							<Show when={role.isRoomProctor}>
								<span class="badge">Room Proctor</span>
							</Show>
						</li>
					)}
				</For>
			</ul>
		</section>
	);
}
