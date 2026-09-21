import { Show } from "solid-js";
import type { FestivalAppController } from "../app/useFestivalAppController.js";
import { Button } from "./Button.js";

interface AppBannersProps {
	app: FestivalAppController;
}

export function AppBanners(props: AppBannersProps) {
	return (
		<>
			<Show when={props.app.errorMessage()}>
				<section class="banner error-banner">
					{props.app.errorMessage()}
				</section>
			</Show>
			<Show when={props.app.statusMessage()}>
				<section class="banner status-banner">
					{props.app.statusMessage()}
				</section>
			</Show>
			<Show when={props.app.needsEmailLinkConfirmation()}>
				<section class="banner status-banner email-link-confirm-banner">
					<p>
						This sign-in link was opened in a different browser or device.
						Confirm your email to finish signing in.
					</p>
					<label class="field">
						<span>Email address</span>
						<input
							type="email"
							value={props.app.signInEmail()}
							onInput={(event) =>
								props.app.setSignInEmail(event.currentTarget.value)
							}
							placeholder="you@example.com"
						/>
					</label>
					<Button
						type="button"
						onClick={() => void props.app.handleConfirmEmailLinkSignIn()}
						disabled={props.app.isBusy()}
					>
						Confirm and sign in
					</Button>
				</section>
			</Show>
		</>
	);
}
