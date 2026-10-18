import { NextRequest } from "next/server";
import { COOKIE_NAME, verifySession } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
  const s = verifySession(req.cookies.get(COOKIE_NAME)?.value);
  return Response.json(s ? { discord_id: s.discord_id, discord_username: s.discord_username } : { discord_id: null });
}
