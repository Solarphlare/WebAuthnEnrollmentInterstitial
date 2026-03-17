import { startRegistration } from "@simplewebauthn/browser";
import { RegistrationResponseJSON } from "@simplewebauthn/types";
import SetupState from "./Types/SetupState";
import turnstileRender from "./turnstile";

export default async function enrollPasskey(setSetupState: (state: SetupState) => void) {
    const turnstileToken = await turnstileRender("#root", {
        sitekey: "0x4AAAAAABoB88S_MNbuZG5w"
    });

    let passkeyCreateOptions: Response;
    try {
        passkeyCreateOptions = await fetch("https://auth.solarphlare.com/auth/public-key/create-registration-options", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ turnstileToken })
        });
    }
    catch {
        throw new Error("Failed to fetch passkey creation options.");
    }

    if (!passkeyCreateOptions.ok) {
        throw new Error("Failed to fetch passkey creation options.");
    }

    const attestationOptions = await passkeyCreateOptions.json();
    let attestationResponse: RegistrationResponseJSON;
    try {
        attestationResponse = await startRegistration(attestationOptions);
    }
    catch {
        setSetupState(SetupState.NotStarted);
        return
    }

    let creationResponse: Response;
    try {
        creationResponse = await fetch("https://auth.solarphlare.com/auth/public-key/register", {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attId: attestationOptions.attId, ...attestationResponse })
        });
    }
    catch {
        throw new Error("Failed to create passkey.");
    }

    if (!creationResponse.ok) {
        throw new Error("Failed to create passkey.");
    }

    const creationResponseBody: { id: string, name: string, created_at: string; } = await creationResponse.json();

    try {
        const sessions = await fetch("https://api.solarphlare.com/users/me/sessions", {
            credentials: "include"
        });

        if (!sessions.ok) return;
        const sessionsData = await sessions.json();

        await fetch(`https://auth.solarphlare.com/users/me/public-keys/${creationResponseBody.id}`, {
            method: "PATCH",
            credentials: "same-origin",
            body: JSON.stringify({
                name: `${sessionsData.currentSession.device} ${creationResponseBody.name}`
            })
        });

        setSetupState(SetupState.Complete);
    }
    catch {
        return;
    }
}
