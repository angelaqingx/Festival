import { createResource, Show } from "solid-js";
import type { FestivalAppController } from "../app/useFestivalAppController.js";
import { AccessDeniedPanel } from "../components/AccessDeniedPanel.js";
import { getAdminFestival } from "../lib/api.js";

export function FestivalAdminDashboardPage(props: {
	app: FestivalAppController;
	slug: string;
	festivalSlug: string;
}) {
	const [festival] = createResource(
		() => {
			const user = props.app.firebaseUser();
			return props.app.isAdminMember() && user
				? ([props.slug, props.festivalSlug, user] as const)
				: null;
		},
		async (input) => {
			if (!input) throw new Error("Sign in to manage this festival.");
			const [slug, festivalSlug, user] = input;
			return getAdminFestival(await user.getIdToken(), slug, festivalSlug);
		},
	);

	return (
		<Show
			when={props.app.isAdminMember()}
			fallback={
				<AccessDeniedPanel message="Only Admin members can manage festivals." />
			}
		>
			<Show when={festival.loading}>
				<section class="panel">
					<p class="muted">Loading festival.</p>
				</section>
			</Show>
			<Show when={festival.error}>
				<section class="panel">
					<p role="alert">Festival not found.</p>
				</section>
			</Show>
			<Show when={festival()}>
				<section class="panel">
					<h2>{festival()?.festival.name}</h2>
					<p>Festival dashboard</p>
					<p>
						Classes management is available after the catalog is configured.
					</p>
				</section>
			</Show>
		</Show>
	);
}
