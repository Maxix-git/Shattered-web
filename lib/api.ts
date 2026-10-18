const API = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

async function get(path, fallback) {
  try {
    const res = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export const getStatus = () => get("/v1/status", { site: "Shattered SMP", tracked_players: 0, data_freshness: "unknown" });
export async function getKillfeed(limit = 20) {
  const d = await get(`/v1/killfeed?limit=${limit}`, []);
  return Array.isArray(d) ? { kills: d } : { kills: d.kills ?? [] };
}
export const getLeaderboard = (metric) => get(`/v1/leaderboards/${metric}`, { metric, entries: [] });
export const searchPlayers = (q, limit = 50) =>
  get(`/v1/players?limit=${limit}${q ? `&search=${encodeURIComponent(q)}` : ""}`, { players: [] });
export const getPlayer = (username) => get(`/v1/players/${encodeURIComponent(username)}`, null);

export function timeAgo(iso) {
  if (!iso) return "never";
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function avatarUrl(p) {
  if (p?.edition === "java" && p?.uuid) return `https://mc-heads.net/avatar/${p.uuid.replace(/-/g, "")}/64`;
  return "/bedrock-avatar.png";
}
