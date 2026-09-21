import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
	type Auth,
	connectAuthEmulator,
	GoogleAuthProvider,
	getAuth,
	isSignInWithEmailLink,
	onIdTokenChanged,
	sendSignInLinkToEmail,
	signInWithEmailLink,
	signInWithPopup,
	signOut,
	type Unsubscribe,
} from "firebase/auth";
import { buildFestivalVolunteersPath, buildInvitePath } from "./routes.js";

type PendingIntent =
	| { kind: "create-org" }
	| { kind: "invite"; inviteToken: string; name: string }
	| { kind: "volunteer"; slug: string; festivalSlug: string };

export class MissingPendingEmailError extends Error {
	constructor() {
		super(
			"This sign-in link was opened in a different browser or device than the one that requested it.",
		);
		this.name = "MissingPendingEmailError";
	}
}

const PENDING_EMAIL_KEY = "festival.pendingEmail";
const PENDING_INTENT_KEY = "festival.pendingIntent";

function getFirebaseConfig() {
	const apiKey = import.meta.env.FRONT_FIREBASE_API_KEY;
	const authDomain = import.meta.env.FRONT_FIREBASE_AUTH_DOMAIN;
	const projectId = import.meta.env.FRONT_FIREBASE_PROJECT_ID;
	const appId = import.meta.env.FRONT_FIREBASE_APP_ID;

	if (!apiKey || !authDomain || !projectId || !appId) {
		return null;
	}

	return {
		apiKey,
		authDomain,
		projectId,
		appId,
	};
}

let firebaseApp: FirebaseApp | null | undefined;
let firebaseAuth: Auth | null | undefined;
let emulatorConnected = false;

export function getFirebaseAuth(): Auth | null {
	if (firebaseAuth !== undefined) {
		return firebaseAuth;
	}

	const config = getFirebaseConfig();
	if (!config) {
		firebaseApp = null;
		firebaseAuth = null;
		return null;
	}

	firebaseApp = getApps()[0] ?? initializeApp(config);
	firebaseAuth = getAuth(firebaseApp);

	const emulatorUrl = import.meta.env.FRONT_FIREBASE_AUTH_EMULATOR_URL?.trim();
	if (emulatorUrl && !emulatorConnected) {
		connectAuthEmulator(firebaseAuth, emulatorUrl, { disableWarnings: true });
		emulatorConnected = true;
	}

	return firebaseAuth;
}

function assertAuth(): Auth {
	const auth = getFirebaseAuth();
	if (!auth) {
		throw new Error(
			"Firebase web configuration is missing. Set the required FRONT_FIREBASE_* environment variables.",
		);
	}

	return auth;
}

function savePendingIntent(intent: PendingIntent) {
	localStorage.setItem(PENDING_INTENT_KEY, JSON.stringify(intent));
}

export function readPendingIntent(): PendingIntent | null {
	const raw = localStorage.getItem(PENDING_INTENT_KEY);
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as PendingIntent;
	} catch {
		return null;
	}
}

export function clearPendingIntent() {
	localStorage.removeItem(PENDING_INTENT_KEY);
	localStorage.removeItem(PENDING_EMAIL_KEY);
}

export function buildEmailLinkUrl(intent: PendingIntent): string {
	if (intent.kind === "invite") {
		return `${window.location.origin}${buildInvitePath(intent.inviteToken)}`;
	}
	if (intent.kind === "volunteer") {
		return `${window.location.origin}${buildFestivalVolunteersPath(intent.slug, intent.festivalSlug)}`;
	}

	return `${window.location.origin}/create-organization`;
}

export async function signInWithGoogle(intent: PendingIntent) {
	savePendingIntent(intent);
	const auth = assertAuth();
	await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function sendPasswordlessEmailLink(input: {
	email: string;
	intent: PendingIntent;
}) {
	const auth = assertAuth();
	localStorage.setItem(PENDING_EMAIL_KEY, input.email);
	savePendingIntent(input.intent);

	await sendSignInLinkToEmail(auth, input.email, {
		url: buildEmailLinkUrl(input.intent),
		handleCodeInApp: true,
	});
}

export async function completePasswordlessEmailLinkSignIn(): Promise<PendingIntent | null> {
	const auth = getFirebaseAuth();
	if (!auth) {
		return null;
	}
	if (!isSignInWithEmailLink(auth, window.location.href)) {
		return null;
	}

	const email = localStorage.getItem(PENDING_EMAIL_KEY);
	if (!email) {
		throw new MissingPendingEmailError();
	}

	const intent = readPendingIntent();
	await signInWithEmailLink(auth, email, window.location.href);
	return intent;
}

export async function completeEmailLinkSignInWithEmail(
	email: string,
): Promise<PendingIntent | null> {
	const auth = assertAuth();
	const intent = readPendingIntent();
	localStorage.setItem(PENDING_EMAIL_KEY, email);
	await signInWithEmailLink(auth, email, window.location.href);
	return intent;
}

export function subscribeToAuthChanges(
	listener: Parameters<typeof onIdTokenChanged>[1],
): Unsubscribe {
	const auth = getFirebaseAuth();
	if (!auth) {
		return () => {};
	}

	return onIdTokenChanged(auth, listener);
}

export async function logoutCurrentUser() {
	const auth = getFirebaseAuth();
	if (auth) {
		await signOut(auth);
	}
	clearPendingIntent();
}
