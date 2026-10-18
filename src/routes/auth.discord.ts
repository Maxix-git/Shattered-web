// GET /auth/discord — bounce to Discord OAuth.
import { createFileRoute } from "@tanstack/react-router";
import { oauthUrl } from "@/server/auth";

export const Route = createFileRoute("/auth/discord")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 302, headers: { location: oauthUrl("shattered") } }),
    },
  },
});
