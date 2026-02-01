export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") || "";

    // Only rewrite homepage
    if (url.pathname === "/") {
        if (accept.includes("text/markdown")) {
            // Internally fetch the deployed asset at /ai.md
            const res = await fetch(new URL("/ai.md", url), request);
            return withVary(res);
        }

        // Otherwise serve normal index
        const res = await fetch(new URL("/index.html", url), request);
        return withVary(res);
    }

    // Everything else: serve normally (static or other functions)
    return context.next();
}

function withVary(res) {
    // Ensure caches know response varies by Accept
    const out = new Response(res.body, res);
    out.headers.set("Vary", "Accept");
    return out;
}
