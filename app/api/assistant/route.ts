// Proxy chat messages to the assistant endpoint on the API.
const API = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const message = typeof b.message === "string" ? b.message.slice(0, 500) : "";
  if (!message) return Response.json({ error: "message required" }, { status: 400 });
  try {
    const res = await fetch(`${API}/v1/assistant/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ name: "Assistant", mode: "stub", reply: "I can't reach my brain right now — try again in a minute!" }, { status: 200 });
  }
}
