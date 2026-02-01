export async function onRequest(context) {
    const req = context.request;
    const url = new URL(req.url);

    const accept = req.headers.get("Accept") || "";
    const ua = (req.headers.get("User-Agent") || "").toLowerCase();

    const wantsMarkdown =
        accept.includes("text/markdown") ||
        ua.includes("parallel");

    // 1) AI agents on "/" get markdown
    if (url.pathname === "/" && wantsMarkdown) {
        const res = await fetch(new URL("/ai.md", url), req);
        return vary(res);
    }

    // 2) Humans: redirect ONLY if we are at "/" AND there is NO "p" query param
    // This guarantees that "/?p=x..." will NEVER redirect again.
    if (url.pathname === "/" && !url.searchParams.has("p")) {
        const target =
            "https://rittmang.xyz/?p=x&order=3,5,1,2&utm_source=x&utm_medium=social&utm_campaign=bio_link";
        return Response.redirect(target, 301);
    }

    // 3) Otherwise (including /?p=x...), serve the site normally
    return context.next();
}

function vary(res) {
    const out = new Response(res.body, res);
    out.headers.set("Vary", "Accept, User-Agent");
    return out;
}
