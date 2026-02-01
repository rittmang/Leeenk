export async function onRequest(context) {
    const req = context.request;
    const url = new URL(req.url);

    const accept = req.headers.get("Accept") || "";
    const ua = req.headers.get("User-Agent") || "";

    const wantsMarkdown =
        accept.includes("text/markdown") ||
        // optional: treat some bots as "agents" even if they don't send Accept
        ua.toLowerCase().includes("gpt") ||
        ua.toLowerCase().includes("claude") ||
        ua.toLowerCase().includes("parallel");

    // Only handle the homepage "/"
    if (url.pathname === "/") {
        if (wantsMarkdown) {
            // Serve your AI markdown asset (same origin)
            const res = await fetch(new URL("/ai.md", url), req);
            return addVary(res);
        }

        // Humans: redirect to your link-hub page with UTMs
        const target =
            "https://rittmang.xyz/?p=x&order=3,5,1,2&utm_source=x&utm_medium=social&utm_campaign=bio_link";

        return Response.redirect(target, 301);
    }

    // Everything else works normally
    return context.next();
}

function addVary(res) {
    const out = new Response(res.body, res);
    out.headers.set("Vary", "Accept, User-Agent");
    return out;
}
