import type {
	CustomerMembershipStatusEntry,
	PublicOrganizationDivision,
} from "@festival/common";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Button } from "../components/Button.js";
import {
	ApiError,
	getCustomerAccompanistProfile,
	getCustomerProfile,
	getCustomerTeacherProfile,
	getPublicDivisions,
	upsertCustomerAccompanistProfile,
	upsertCustomerTeacherProfile,
} from "../lib/api.js";
import {
	buildTeacherDirectoryDraft,
	clearPendingTeacherDirectoryOptIn,
	formatTeacherVisibilityBadge,
	readPendingTeacherDirectoryOptIn,
	resolveActiveAccompanistGrantDivisionIds,
	resolveActiveTeacherGrantDivisionIds,
	type TeacherDirectoryDraftState,
	toggleDivisionSelection,
} from "./teacherDirectoryHelpers.js";

export type DirectoryCardRole = "teacher" | "accompanist";

export interface CustomerTeacherDirectoryCardProps {
	slug: string;
	csrfToken: string;
	memberships: readonly CustomerMembershipStatusEntry[];
	role?: DirectoryCardRole;
}

const ROLE_CONFIG = {
	teacher: {
		headingId: "teacher-directory-card-heading",
		heading: "Public Teacher Directory",
		optInLabel: "Show my profile in the Public Teacher Directory",
		loadingText: "Loading teacher directory profile…",
		loadErrorText: "Teacher directory settings could not be loaded.",
		saveErrorText: "Teacher directory profile could not be saved.",
	},
	accompanist: {
		headingId: "accompanist-directory-card-heading",
		heading: "Public Accompanist Directory",
		optInLabel: "Show my profile in the Public Accompanist Directory",
		loadingText: "Loading accompanist directory profile…",
		loadErrorText: "Accompanist directory settings could not be loaded.",
		saveErrorText: "Accompanist directory profile could not be saved.",
	},
} as const;

async function fetchInitialDirectoryBundle(
	slug: string,
	memberships: readonly CustomerMembershipStatusEntry[],
	role: DirectoryCardRole,
) {
	const isAcc = role === "accompanist";
	const [profile, customerResp, divisionResp] = await Promise.all([
		isAcc
			? getCustomerAccompanistProfile(slug)
			: getCustomerTeacherProfile(slug),
		getCustomerProfile(slug).catch(() => null),
		getPublicDivisions(slug),
	]);
	const divisions = divisionResp.divisions;
	const pendingOptIn = isAcc ? null : readPendingTeacherDirectoryOptIn(slug);
	const activeDivisionIds = isAcc
		? resolveActiveAccompanistGrantDivisionIds(memberships, divisions)
		: resolveActiveTeacherGrantDivisionIds(memberships, divisions);
	const draft = buildTeacherDirectoryDraft({
		profile,
		customerName: customerResp?.profile.name ?? null,
		activeDivisionIds,
		pendingOptIn,
	});
	return {
		divisions,
		draft,
		shouldAutoSave:
			!isAcc &&
			profile === null &&
			pendingOptIn !== null &&
			Boolean(draft.displayName),
	};
}

interface CardUiState {
	loading: boolean;
	saving: boolean;
	error: string;
	savedMessage: string;
}

interface SaveDraftContext {
	props: CustomerTeacherDirectoryCardProps;
	role: () => DirectoryCardRole;
	state: { disposed: boolean };
	setDraft: (next: TeacherDirectoryDraftState) => void;
	patchUi: (next: Partial<CardUiState>) => void;
}

async function upsertRoleDirectoryProfile(
	props: CustomerTeacherDirectoryCardProps,
	role: DirectoryCardRole,
	payload: {
		displayName: string;
		publicDirectoryOptIn: boolean;
		divisionIds: string[];
	},
) {
	return role === "accompanist"
		? upsertCustomerAccompanistProfile(props.slug, props.csrfToken, payload)
		: upsertCustomerTeacherProfile(props.slug, props.csrfToken, payload);
}

async function saveCardDraft(
	ctx: SaveDraftContext,
	target: TeacherDirectoryDraftState,
	savedMessage: string,
): Promise<void> {
	const displayName = target.displayName.trim();
	if (!displayName) {
		ctx.patchUi({ error: "Display name is required." });
		return;
	}
	ctx.patchUi({ saving: true, error: "", savedMessage: "" });
	const currentRole = ctx.role();
	try {
		const saved = await upsertRoleDirectoryProfile(ctx.props, currentRole, {
			displayName,
			publicDirectoryOptIn: target.publicDirectoryOptIn,
			divisionIds: target.divisionIds,
		});
		if (ctx.state.disposed) return;
		if (currentRole === "teacher") {
			clearPendingTeacherDirectoryOptIn(ctx.props.slug);
		}
		ctx.setDraft(buildTeacherDirectoryDraft({ profile: saved }));
		ctx.patchUi({ savedMessage });
	} catch (e) {
		const error =
			e instanceof ApiError
				? e.message
				: ROLE_CONFIG[currentRole].saveErrorText;
		if (!ctx.state.disposed) ctx.patchUi({ error });
	} finally {
		if (!ctx.state.disposed) ctx.patchUi({ saving: false });
	}
}

function createTeacherCardController(props: CustomerTeacherDirectoryCardProps) {
	const role = () => props.role ?? "teacher";
	const cfg = () => ROLE_CONFIG[role()];
	const [ui, setUi] = createSignal<CardUiState>({
		loading: true,
		saving: false,
		error: "",
		savedMessage: "",
	});
	const patchUi = (next: Partial<CardUiState>) =>
		setUi((cur) => ({ ...cur, ...next }));
	const [divisions, setDivisions] = createSignal<PublicOrganizationDivision[]>(
		[],
	);
	const [draft, setDraft] = createSignal(
		buildTeacherDirectoryDraft({ profile: null }),
	);
	const patchDraft = (next: Partial<TeacherDirectoryDraftState>) =>
		setDraft((cur) => ({ ...cur, ...next }));
	const state = { disposed: false };
	const save = (target: TeacherDirectoryDraftState, msg: string) =>
		saveCardDraft({ props, role, state, setDraft, patchUi }, target, msg);
	return {
		role,
		cfg,
		ui,
		patchUi,
		divisions,
		setDivisions,
		draft,
		setDraft,
		patchDraft,
		save,
		state,
	};
}
type TeacherCardCtrl = ReturnType<typeof createTeacherCardController>;
function DivisionCheckboxes(props: { ctrl: TeacherCardCtrl }) {
	const ids = () => props.ctrl.draft().divisionIds;
	return (
		<Show when={props.ctrl.divisions().length > 0}>
			<fieldset class="field">
				<legend>Approved divisions</legend>
				<For each={props.ctrl.divisions()}>
					{(div) => (
						<label class="membership-consent">
							<input
								type="checkbox"
								checked={ids().includes(div.id)}
								disabled={props.ctrl.ui().saving}
								onChange={(e) =>
									props.ctrl.patchDraft({
										divisionIds: toggleDivisionSelection(
											ids(),
											div.id,
											e.currentTarget.checked,
										),
									})
								}
							/>
							<span>{div.displayName}</span>
						</label>
					)}
				</For>
			</fieldset>
		</Show>
	);
}
function TeacherDirectoryForm(props: { ctrl: TeacherCardCtrl }) {
	const c = props.ctrl;
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				void c.save(c.draft(), "Directory profile saved.");
			}}
		>
			<label class="field">
				<span>Display name</span>
				<input
					type="text"
					maxLength={100}
					value={c.draft().displayName}
					disabled={c.ui().saving}
					onInput={(e) => c.patchDraft({ displayName: e.currentTarget.value })}
				/>
			</label>
			<DivisionCheckboxes ctrl={c} />
			<label class="membership-consent">
				<input
					type="checkbox"
					checked={c.draft().publicDirectoryOptIn}
					disabled={c.ui().saving}
					onChange={(e) =>
						c.patchDraft({ publicDirectoryOptIn: e.currentTarget.checked })
					}
				/>
				<span>{c.cfg().optInLabel}</span>
			</label>
			<div class="membership-checkout-actions">
				<Button type="submit" disabled={c.ui().saving}>
					{c.ui().saving ? "Saving…" : "Save directory profile"}
				</Button>
			</div>
		</form>
	);
}
function loadBundle(
	props: CustomerTeacherDirectoryCardProps,
	ctrl: TeacherCardCtrl,
) {
	void fetchInitialDirectoryBundle(props.slug, props.memberships, ctrl.role())
		.then(async ({ divisions, draft, shouldAutoSave }) => {
			if (ctrl.state.disposed) return;
			ctrl.setDivisions(divisions);
			ctrl.setDraft(draft);
			if (shouldAutoSave)
				await ctrl.save(draft, "Directory listing preference saved.");
		})
		.catch(() => {
			if (!ctrl.state.disposed)
				ctrl.patchUi({ error: ctrl.cfg().loadErrorText });
		})
		.finally(() => !ctrl.state.disposed && ctrl.patchUi({ loading: false }));
}
export function CustomerTeacherDirectoryCard(
	props: CustomerTeacherDirectoryCardProps,
) {
	const ctrl = createTeacherCardController(props);
	onMount(() => loadBundle(props, ctrl));
	onCleanup(() => {
		ctrl.state.disposed = true;
	});
	const badge = () =>
		formatTeacherVisibilityBadge(ctrl.draft().visibilityStatus);
	return (
		<section
			class="customer-membership-section teacher-directory-card"
			aria-labelledby={ctrl.cfg().headingId}
		>
			<header class="customer-membership-section-header">
				<div>
					<h2 id={ctrl.cfg().headingId}>{ctrl.cfg().heading}</h2>
					<p class="muted">Manage your public directory name and divisions.</p>
				</div>
				<span class={`directory-status-tag ${badge().badgeClass}`}>
					{badge().label}
				</span>
			</header>
			<Show when={ctrl.ui().loading}>
				<p role="status">{ctrl.cfg().loadingText}</p>
			</Show>
			<Show when={ctrl.ui().error}>
				{(err) => (
					<p class="error-text" role="alert">
						{err()}
					</p>
				)}
			</Show>
			<Show when={ctrl.ui().savedMessage}>
				{(msg) => <p role="status">{msg()}</p>}
			</Show>
			<Show when={ctrl.draft().visibilityStatus === "hidden_by_admin"}>
				<p class="muted" role="status">
					An organization administrator has hidden this profile.
				</p>
			</Show>
			<Show when={!ctrl.ui().loading}>
				<TeacherDirectoryForm ctrl={ctrl} />
			</Show>
		</section>
	);
}
