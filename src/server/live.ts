// Server logic for the website. v0.5: the site is a STATELESS client.
// The Discord bot owns the database and serves it over an authenticated API
// (POST /api/site/rpc, Bearer WEBSITE_API_KEY). This file:
//   1. pings the Minecraft server itself (status stays site-side)
//   2. fetches live/me/act payloads from the bot
//   3. keeps session + CSRF handling site-side (Discord OAuth)
import { getSession, csrfOk, csrfToken, isAdmin, type Sess } from "./auth";
import net from "node:net";

// ---------- Bot data API client ----------
// Read env at CALL time, not module load time, so dotenv always wins
// regardless of module evaluation order in dev/build.
const API = () => (process.env["SITE_API_URL"] || "http://127.0.0.1:4000").replace(/\/$/, "");
const KEY = () => process.env["SITE_API_KEY"] || "";

async function rpc(op: string, user: Record<string, any> | null, args?: Record<string, any>): Promise<any> {
  const res = await fetch(`${API()}/api/site/rpc`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${KEY()}` },
    body: JSON.stringify({ op, user, args: args || {} }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`api ${res.status}`);
  return res.json();
}

// ---------- Minecraft ping (Java). Zero deps. Stays on the site: ----------
// the site pings the game server directly, so the homepage status badge keeps
// working even if the bot API is briefly down.
function mcPing(host: string, port = 25565, timeout = 4000): Promise<any> {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port, timeout });
    const t0 = Date.now();
    const vi = (n: number) => { const b: number[] = []; do { let x = n & 0x7f; n >>>= 7; if (n) x |= 0x80; b.push(x); } while (n); return Buffer.from(b); };
    const pkt = (id: number, data: Buffer) => { const body = Buffer.concat([vi(id), data]); return Buffer.concat([vi(body.length), body]); };
    sock.on("connect", () => {
      const h = Buffer.from(host);
      const hs = Buffer.concat([vi(765), vi(h.length), h, Buffer.from([port >> 8, port & 255]), vi(1)]);
      sock.write(pkt(0, hs)); sock.write(pkt(0, Buffer.alloc(0)));
    });
    let buf = Buffer.alloc(0);
    sock.on("data", (d) => {
      buf = Buffer.concat([buf, d]);
      const s = buf.toString("utf8"); const a = s.indexOf("{"); const z = s.lastIndexOf("}");
      if (a >= 0 && z > a) { try { const j = JSON.parse(s.slice(a, z + 1)); sock.destroy(); resolve({ ...j, ms: Date.now() - t0 }); } catch {} }
    });
    sock.on("error", () => resolve(null));
    sock.on("timeout", () => { sock.destroy(); resolve(null); });
  });
}

let pingCache: { at: number; data: any } = { at: 0, data: null };
async function status() {
  const host = process.env["MC_HOST"] || "";
  if (!host) return { configured: false, online: false, host: "", playersOnline: 0, playersMax: 0, version: "", ms: 0 };
  if (Date.now() - pingCache.at < 10000 && pingCache.data) return pingCache.data;
  const p = await mcPing(host, Number(process.env["MC_PORT"]) || 25565);
  const data = {
    configured: true,
    online: !!p,
    host,
    playersOnline: p?.players?.online ?? 0,
    playersMax: p?.players?.max ?? 0,
    version: (p?.version?.name || "").replace(/^.*?(\d[\w.]*)$/, "$1"),
    ms: p?.ms ?? 0,
    onlineNames: (p?.players?.sample || []).map((x: any) => x.name),
  };
  pingCache = { at: Date.now(), data };
  return data;
}

// ---------- Live payload: API data + merged server status ----------
// Server status has TWO independent signals, and the site now uses both:
//   1. the plugin heartbeat stored by the API (works even when the Minecraft
//      port is firewalled from Vercel, needs no MC_HOST)
//   2. a direct server-list ping from this site (needs MC_HOST; gives latency)
// The server counts as online if EITHER says so.
function mergeStatus(ping: any, hb: any, apiPlayersOnline: number) {
  const hbLive = !!hb?.live;
  const online = !!ping?.online || hbLive;
  let playersOnline = hbLive ? Number(hb.playersOnline) || 0 : Number(ping?.playersOnline) || 0;
  if (online && playersOnline === 0 && apiPlayersOnline > 0) playersOnline = apiPlayersOnline;
  return {
    configured: !!ping?.configured || !!hb,
    online,
    host: ping?.host || "",
    playersOnline,
    playersMax: (hbLive ? Number(hb.playersMax) : 0) || Number(ping?.playersMax) || 0,
    version: ping?.version || hb?.version || "",
    ms: ping?.ms || 0,
    tps: hbLive ? hb.tps : null,
    motd: hbLive ? hb.motd : "",
    source: hbLive ? "plugin" : ping?.online ? "ping" : "none",
    heartbeatAge: hb ? Number(hb.ageSeconds) : null,
    onlineNames: ping?.onlineNames || [],
  };
}

export async function buildLive() {
  // run the Minecraft ping and the API call in parallel (ping can take 4s)
  const [pingRes, apiRes] = await Promise.allSettled([status(), rpc("live", null)]);
  const ping: any = pingRes.status === "fulfilled" ? pingRes.value : null;
  let data: any;
  let apiDown = false;
  try {
    if (apiRes.status !== "fulfilled") throw apiRes.reason;
    data = apiRes.value;
    if (!data || !Array.isArray(data.players)) throw new Error("bad payload");
    const onlineNames: string[] = ping?.onlineNames || [];
    // overlay real online state from our own ping, when it gave us names
    if (onlineNames.length) {
      data.players = data.players.map((p: any) => ({ ...p, online: onlineNames.includes(p.name) }));
    }
  } catch {
    // API unreachable: show an honest empty site with a live status badge
    apiDown = true;
    data = {
      players: [], factions: [], posts: [], news: [], feed: [], bounties: [], zones: [],
      meta: { players: 0, kills: 0, factions: 0, worldAgeDays: 0 },
      apiDown: true,
    };
  }
  const apiOnline = (data.players as any[]).filter((p) => p.online).length;
  const { heartbeat, ...rest } = data;
  return { ...rest, apiDown, status: mergeStatus(ping, heartbeat, apiOnline) };
}

// ---------- Session payload ----------
export async function buildMe(sess: Sess) {
  if (!sess) {
    return { logged: false, username: null, avatar: null, csrf: null, admin: false, linked: false, mcName: null, donorUntil: 0, faction: null, factionMembers: [], notifications: [], stats: null };
  }
  let data: any = {};
  try {
    data = await rpc("me", { u: sess.u, n: sess.n, a: sess.a, admin: isAdmin(sess) });
  } catch {
    data = { linked: false, mcName: null, donorUntil: 0, faction: null, factionMembers: [], notifications: [], stats: null, apiDown: true };
  }
  return {
    logged: true,
    username: sess.n,
    avatar: sess.a,
    csrf: csrfToken(sess),
    admin: isAdmin(sess),
    ...data,
  };
}

// ---------- Write actions (session + CSRF stay site-side, DB work on the bot) ----------
export async function act(sess: Sess, body: Record<string, any>): Promise<{ ok: boolean; msg: string }> {
  if (!sess) return { ok: false, msg: "Log in first." };
  if (!csrfOk(sess, body["_csrf"])) return { ok: false, msg: "Bad session token. Refresh." };
  try {
    return await rpc("act", { u: sess.u, n: sess.n, a: sess.a, admin: isAdmin(sess) }, body);
  } catch {
    return { ok: false, msg: "Backend unreachable. Try again in a moment." };
  }
}
