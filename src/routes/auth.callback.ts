// GET /auth/callback — exchange the OAuth code, set the session cookie.
import { createFileRoute } from "@tanstack/react-router";
import { oauthToken, sessionCookie } from "@/server/auth";

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        if (!code) return new Response(null, { status: 302, headers: { location: "/?msg=oauth_failed" } });
        const user = await oauthToken(code);
        if (!user) return new Response(null, { status: 302, headers: { location: "/?msg=oauth_failed" } });
        return new Response(null, {
          status: 302,
          headers: { location: "/dashboard", "set-cookie": sessionCookie(user.id, user.name, user.avatar) },
        });
      },
    },
  },
});
