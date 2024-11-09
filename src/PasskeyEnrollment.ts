import { startRegistration } from "@simplewebauthn/browser";

export default async function enrollPasskey() {

    let passkeyCreateOptions: Response;
    try {
        passkeyCreateOptions = await fetch("https://auth.cominatyou.com/auth/public-key/create-registration-options", {
            method: "POST",
            credentials: "same-origin"
        });
    }
    catch {
        throw new Error("Failed to fetch passkey creation options.");
    }

    if (!passkeyCreateOptions.ok) {
        throw new Error("Failed to fetch passkey creation options.");
    }

    const attestationOptions = await passkeyCreateOptions.json();
    const attestationResponse = await startRegistration(attestationOptions);

    let creationResponse: Response;
    try {
        creationResponse = await fetch("https://auth.cominatyou.com/auth/public-key/register", {
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
        const sessions = await fetch("https://api.cominatyou.com/users/me/sessions", {
            credentials: "same-origin"
        });

        if (!sessions.ok) return;
        const sessionsData = await sessions.json();

        await fetch(`https://auth.cominatyou.com/users/me/public-keys/${creationResponseBody.id}`, {
            method: "PATCH",
            credentials: "same-origin",
            body: JSON.stringify({
                name: `${sessionsData.currentSession.device} ${creationResponseBody.name}`
            })
        });
    }
    catch {
        return;
    }
}
