// POST /api/assistant — proxy the website chat bubble to the Shattered API.
// Kept server-side so the API URL stays private and the browser hits one origin.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, any> = {};
        try { body = await request.json(); } catch {}
        const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
        if (!message) return Response.json({ ok: false, error: "message required" }, { status: 400 });
        const api = (process.env["SITE_API_URL"] || "").replace(/\/$/, "");
        if (!api) return Response.json({ ok: false, error: "assistant not configured" }, { status: 503 });
        try {
          const r = await fetch(`${api}/v1/assistant/chat`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ message }),
            signal: AbortSignal.timeout(8000),
          });
          const j = await r.json().catch(() => ({ reply: "I could not reach the server data. Try again in a moment." }));
          return Response.json({ ok: true, reply: j.reply || "…", name: j.name || "Shard" });
        } catch {
          return Response.json({ ok: false, error: "backend unreachable" }, { status: 502 });
        }
      },
    },
  },
});
