// Session auth: Discord OAuth (same flow as the bot's website used, ported to
// TanStack Start). HMAC-signed cookie sessions + CSRF tokens.
import crypto from "node:crypto";

const SECRET = () => process.env["SESSION_SECRET"] || "shattered-dev-secret";
const DAY = 86400;

export type Sess = { u: string; n: string; a: string | null; e: number } | null;

export type Req = { headers: { get(name: string): string | null } };

export function getCookie(req: Req, name: string): string | null {
  const h = req.headers.get("cookie") || "";
  for (const part of h.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export function getSession(req: Req): Sess {
  const raw = getCookie(req, "s");
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const want = crypto.createHmac("sha256", SECRET()).update(payload).digest("base64url");
  if (sig !== want) return null;
  try {
    const d = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (d.e < Math.floor(Date.now() / 1000)) return null;
    return d;
  } catch {
    return null;
  }
}

export function sessionCookie(discordId: string, name: string, avatar: string | null): string {
  const payload = Buffer.from(
    JSON.stringify({ u: discordId, n: name, a: avatar, e: Math.floor(Date.now() / 1000) + 30 * DAY }),
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET()).update(payload).digest("base64url");
  return `s=${payload}.${sig}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * DAY}`;
}

export function clearCookie(): string {
  return "s=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

export function csrfToken(sess: Sess): string {
  return crypto.createHmac("sha256", SECRET()).update("csrf:" + sess!.u).digest("base64url");
}
export function csrfOk(sess: Sess, token: unknown): boolean {
  return !!sess && typeof token === "string" && token === csrfToken(sess);
}

export function isAdmin(sess: Sess): boolean {
  return !!sess && (process.env["ADMIN_DISCORD_IDS"] || "").split(",").map((x) => x.trim()).includes(sess.u);
}

// OAuth endpoints
export function oauthUrl(state: string): string {
  const clientId = process.env["DISCORD_CLIENT_ID"] || "";
  const redirect =
    process.env["DISCORD_CALLBACK_URL"] ||
    `https://${process.env["PUBLIC_HOST"] || "localhost:3000"}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirect,
    response_type: "code",
    scope: "identify",
    state,
  });
  return `https://discord.com/oauth2/authorize?${params}`;
}

export async function oauthToken(code: string): Promise<{ id: string; name: string; avatar: string | null } | null> {
  const clientId = process.env["DISCORD_CLIENT_ID"] || "";
  const clientSecret = process.env["DISCORD_CLIENT_SECRET"] || "";
  const redirect =
    process.env["DISCORD_CALLBACK_URL"] ||
    `https://${process.env["PUBLIC_HOST"] || "localhost:3000"}/auth/callback`;
  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "authorization_code", code, redirect_uri: redirect });
  const r = await fetch("https://discord.com/api/oauth2/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!r.ok) return null;
  const tok = await r.json();
  const me = await fetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${tok.access_token}` } });
  if (!me.ok) return null;
  const u = await me.json();
  return { id: u.id, name: u.global_name || u.username, avatar: u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png` : null };
}
