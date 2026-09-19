import { createResource, Show } from "solid-js";
import type { FestivalAppController } from "../app/useFestivalAppController.js";
import { AccessDeniedPanel } from "../components/AccessDeniedPanel.js";
import { Button } from "../components/Button.js";
import { getAdminFestival } from "../lib/api.js";
import { buildFestivalAdminPath } from "../lib/routes.js";

export function FestivalAdminClassesPage(props: {
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
				<AccessDeniedPanel message="Only Admin members can manage festival classes." />
			}
		>
			<Show when={festival.loading}>
				<section class="panel">
					<p class="muted">Loading festival classes.</p>
				</section>
			</Show>
			<Show when={festival.error}>
				<section class="panel">
					<p role="alert">Festival not found.</p>
				</section>
			</Show>
			<Show when={festival()}>
				<section class="panel flow-panel">
					<header class="admin-page-header">
						<div>
							<h2>{festival()?.festival.name} classes</h2>
							<p>Class catalog management is scoped to this Festival.</p>
						</div>
					</header>
					<p class="muted">
						Class catalog configuration will be available here.
					</p>
					<Button
						type="button"
						onClick={() =>
							props.app.navigate(
								buildFestivalAdminPath(props.slug, props.festivalSlug),
							)
						}
					>
						Back to Festival dashboard
					</Button>
				</section>
			</Show>
		</Show>
	);
}
