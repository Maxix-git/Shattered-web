// GET /api/me — session payload. POST /api/me — authed actions (op + _csrf).
import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "@/server/auth";
import { buildMe, act } from "@/server/live";

export const Route = createFileRoute("/api/me")({
  server: {
    handlers: {
      GET: async ({ request }) => Response.json(await buildMe(getSession(request)), { headers: { "cache-control": "no-store" } }),
      POST: async ({ request }) => {
        let body: Record<string, any> = {};
        try { body = await request.json(); } catch {}
        const r = await act(getSession(request), body);
        return Response.json(r, { status: r.ok ? 200 : 400, headers: { "cache-control": "no-store" } });
      },
    },
  },
});
