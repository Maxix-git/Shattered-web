// Discord OAuth callback: verify state (CSRF), exchange code, load
// profile, set a signed httpOnly session cookie. Discord-only login.
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, signSession } from "../../../../../lib/auth";

export async function GET(req: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const cookieState = req.cookies.get("shatty_oauth_state")?.value ?? "";
  const secure = process.env.NODE_ENV === "production";

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/link?error=notconfigured", req.nextUrl.origin));
  }
  if (!code) {
    return NextResponse.redirect(new URL("/link?error=missingcode", req.nextUrl.origin));
  }
  // CSRF check: the state Discord echoed must match our cookie.
  const stateOk = !!state && state === cookieState &&
    /^[a-f0-9]+$/i.test(state) &&
    crypto.timingSafeEqual(Buffer.from(state), Buffer.from(cookieState));
  if (!stateOk) {
    return NextResponse.redirect(new URL("/link?error=badstate", req.nextUrl.origin));
  }
  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        grant_type: "authorization_code", code, redirect_uri: redirectUri,
      }),
    });
    if (!tokenRes.ok) throw new Error("token exchange failed");
    const tok = (await tokenRes.json()).access_token;
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { authorization: `Bearer ${tok}` },
    });
    if (!userRes.ok) throw new Error("profile fetch failed");
    const u = await userRes.json();
    const res = NextResponse.redirect(new URL("/link?login=ok", req.nextUrl.origin));
    res.cookies.set(COOKIE_NAME, signSession({
      discord_id: String(u.id), discord_username: String(u.username ?? ""),
    }), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 30 * 24 * 3600, secure });
    res.cookies.set("shatty_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  } catch {
    return NextResponse.redirect(new URL("/link?error=oauth", req.nextUrl.origin));
  }
}
