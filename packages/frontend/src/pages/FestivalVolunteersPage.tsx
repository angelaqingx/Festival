import { createResource, Show } from "solid-js";
import type { FestivalAppController } from "../app/useFestivalAppController.js";
import { Button } from "../components/Button.js";
import { getPublicFestival } from "../lib/api.js";

interface FestivalVolunteersPageProps {
	app: FestivalAppController;
	slug: string;
	festivalSlug: string;
}

export function FestivalVolunteersPage(props: FestivalVolunteersPageProps) {
	const [festival] = createResource(
		() => [props.slug, props.festivalSlug] as const,
		([slug, festivalSlug]) => getPublicFestival(slug, festivalSlug),
	);

	return (
		<>
			<Show when={festival.state === "pending"}>
				<section class="org-landing">
					<p class="muted">Loading festival.</p>
				</section>
			</Show>
			<Show when={festival.state === "errored"}>
				<section class="org-landing">
					<p role="alert">Festival not found.</p>
				</section>
			</Show>
			<Show when={festival.state === "ready" && festival()}>
				<section class="org-landing">
					<h2>Volunteer for {festival()?.festival.name}</h2>
					<Show
						when={props.app.firebaseUser()}
						fallback={
							<>
								<p>Sign in to choose volunteer roles and shifts.</p>
								<Button
									type="button"
									onClick={() => props.app.openSignInModal("volunteer")}
								>
									Sign in to volunteer
								</Button>
							</>
						}
					>
						{(user) => (
							<>
								<p>Signed in as {user().email}.</p>
								<p class="muted">
									Volunteer role and shift selection is not available yet.
								</p>
								<Button
									type="button"
									variant="secondary"
									onClick={props.app.handleLogout}
									disabled={props.app.isBusy()}
								>
									Sign out
								</Button>
							</>
						)}
					</Show>
				</section>
			</Show>
		</>
	);
}
