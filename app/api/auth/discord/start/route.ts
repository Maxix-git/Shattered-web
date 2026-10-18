// Start Discord OAuth: redirect to Discord's consent screen with a
// random `state` for CSRF protection (httpOnly cookie, verified in
// the callback). This is the ONLY login path — no placeholder accounts.
export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return Response.json({ error: "Discord login is not configured yet" }, { status: 503 });
  }
  const state = crypto.randomUUID().replace(/-/g, "");
  const url =
    "https://discord.com/oauth2/authorize?client_id=" + encodeURIComponent(clientId) +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&response_type=code&scope=identify&state=" + encodeURIComponent(state);
  const res = Response.redirect(url, 302);
  const headers = new Headers(res.headers);
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  headers.append("set-cookie",
    `shatty_oauth_state=${state}; HttpOnly;${secure} Path=/; SameSite=Lax; Max-Age=600`);
  return new Response(null, { status: 302, headers });
}
