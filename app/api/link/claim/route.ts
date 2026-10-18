// Forward a /link claim to the API (server-to-server with INTERNAL_SECRET).
import { NextRequest } from "next/server";
import { COOKIE_NAME, verifySession } from "../../../../lib/auth";

const API = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  const s = verifySession(req.cookies.get(COOKIE_NAME)?.value);
  if (!s) return Response.json({ error: "log in with Discord first" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const code = typeof b.code === "string" ? b.code.trim().toUpperCase() : "";
  if (!/^[ACDEFGHJKLMNPQRTUVWXY346789]{6}$/.test(code)) {
    return Response.json({ error: "enter the 6-character code from /link" }, { status: 400 });
  }
  try {
    const res = await fetch(`${API}/v1/link/claim`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": process.env.INTERNAL_SECRET ?? "",
      },
      body: JSON.stringify({
        code, discord_id: s.discord_id, discord_username: s.discord_username,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "website backend unreachable" }, { status: 502 });
  }
}
