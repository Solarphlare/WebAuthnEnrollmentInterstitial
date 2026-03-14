export default function turnstileRender(container: string | HTMLElement, params: Turnstile.RenderParameters) {
    return new Promise<string>((resolve, reject) => {
        turnstile.render(container, {
            ...params,
            callback: (token) => resolve(token),
            "error-callback": () => reject(new Error("Turnstile error")),
            "expired-callback": () => reject(new Error("Turnstile expired")),
        })
    });
}
