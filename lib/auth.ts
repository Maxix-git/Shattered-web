// Server-side session helpers: HMAC-signed cookie (works on serverless, no DB).
import crypto from "node:crypto";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret";
export const COOKIE_NAME = "shatty_session";
const b64 = (b: crypto.BinaryLike) =>
  Buffer.from(b as any).toString("base64url") as string;

export type Session = { discord_id: string; discord_username: string };

export function signSession(payload: Session): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token?: string | null): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof p?.discord_id !== "string" || !/^\d{2,25}$/.test(p.discord_id)) return null;
    return { discord_id: p.discord_id, discord_username: String(p.discord_username ?? "") };
  } catch {
    return null;
  }
}
