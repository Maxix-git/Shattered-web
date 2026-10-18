// Data layer. Only "Shard" (the site assistant) ships as a placeholder player;
// everything else renders from live backend data (/api/live, /api/me).

export type Player = {
  name: string;
  faction: string;
  kills: number;
  deaths: number;
  streak: number;
  hours: number;
  rank: string;
  online: boolean;
  tone: string;
  face: string;
  wealth: number;
  honor: number;
  bountyClaims: number;
  openBounties: number;
  owner?: boolean;
  donor?: boolean;
  linked?: boolean;
  avatar?: string | null;
};

export type Faction = {
  name: string;
  tag: string;
  members: number;
  kills: number;
  tone: string;
  description: string;
  alliance: string;
  rival: string;
};

export type Post = {
  id: string;
  title: string;
  category: string;
  author: string;
  time: string;
  replies: number;
  body: string;
};

export type Bounty = { id: number; target: string; poster: string; reward: number; time: string };
export type Zone = { label: string; count: number };
export type NewsItem = { title: string; body: string; author: string; time: string };
export type FeedEntry = [string, string, string, string];

const TONES = ["jade", "rose", "violet", "gold", "cyan", "iron"];
const toneFor = (name: string) =>
  TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
const rankFor = (kills: number, hours: number) => {
  if (kills >= 1000 || hours >= 1000) return "Legend";
  if (kills >= 250 || hours >= 400) return "Titan";
  if (kills >= 50 || hours >= 100) return "Warrior";
  return "Explorer";
};

// ---- sample fallbacks (only visible when the backend is unreachable) ----
export const players: [Player, ...Player[]] = [
  {
    name: "Shard", faction: "Unaffiliated", kills: 0, deaths: 0, streak: 0, hours: 0,
    rank: "Sentinel", online: true, tone: "jade", face: "S", wealth: 0, honor: 0, bountyClaims: 0, openBounties: 0,
  },
];

export const factions: Faction[] = [];

export const posts: Post[] = [];

export const news: NewsItem[] = [];
export const feed: FeedEntry[] = [];
export const bounties: Bounty[] = [];
export const zones: Zone[] = [];

export const serverStatus = {
  configured: false, online: false, host: "", playersOnline: 0, playersMax: 0, version: "", ms: 0,
};

export const siteMeta = { players: 0, kills: 0, factions: 0, worldAgeDays: 0, online: 0 };

export type Me = {
  logged: boolean;
  username: string | null;
  avatar: string | null;
  csrf: string | null;
  admin: boolean;
  linked: boolean;
  mcName: string | null;
  donorUntil: number;
  faction: { id: number; name: string; tag: string; description: string; role: string; isOwner: boolean } | null;
  factionMembers: { discordId: string; mcName: string; role: string }[];
  notifications: { id: number; kind: string; body: string; time: string }[];
  stats: {
    kills: number; deaths: number; streak: number; bestStreak: number; hours: number;
    chunks: number; reputation: number; firstJoin: number; honor: number;
  } | null;
};

export const me: Me = {
  logged: false, username: null, avatar: null, csrf: null, admin: false, linked: false,
  mcName: null, donorUntil: 0, faction: null, factionMembers: [], notifications: [], stats: null,
};

export function isDonor() {
  return me.donorUntil > Date.now() / 1000;
}

let live = false;
export function isLive() {
  return live;
}

function hydrateLive(d: any) {
  const mappedPlayers = d.players.map((p: any) => ({
    name: p.name,
    faction: p.faction || "Unaffiliated",
    kills: p.kills,
    deaths: p.deaths,
    streak: p.streak,
    hours: p.hours,
    rank: rankFor(p.kills, p.hours),
    online: !!p.online,
    tone: toneFor(p.name),
    face: p.name.slice(0, 1).toUpperCase(),
    wealth: p.wealth,
    honor: p.honor || 0,
    bountyClaims: p.bountyClaims || 0,
    openBounties: p.openBounties || 0,
    owner: !!p.owner,
    donor: !!p.donor,
    linked: !!p.linked,
    avatar: p.avatar || null,
  })) as [Player, ...Player[]];
  if (mappedPlayers.length) {
    players.length = 0;
    players.push(...mappedPlayers);
  }
  const mappedFactions = (d.factions || []).map((c: any) => ({
    name: c.name, tag: c.tag || "—", members: c.members, kills: c.kills,
    tone: toneFor(c.name), description: c.description || "No description yet.",
    alliance: c.alliance || "None", rival: c.rival || "None",
  })) as [Faction, ...Faction[]];
  if (mappedFactions.length) {
    factions.length = 0;
    factions.push(...mappedFactions);
  }
  posts.length = 0;
  posts.push(...(d.posts || []));
  news.length = 0;
  news.push(...(d.news || []));
  feed.length = 0;
  feed.push(...(d.feed || []));
  bounties.length = 0;
  bounties.push(...(d.bounties || []));
  zones.length = 0;
  zones.push(...(d.zones || []));
  Object.assign(serverStatus, d.status || {});
  Object.assign(siteMeta, d.meta || {});
  live = true;
}

export function hydrateMe(d: Me) {
  Object.assign(me, d);
}

export async function fetchLive(): Promise<boolean> {
  try {
    const r = await fetch("/api/live", { headers: { accept: "application/json" } });
    if (!r.ok) return false;
    const d = await r.json();
    if (!d || !Array.isArray(d.players) || d.players.length === 0) return false;
    hydrateLive(d);
    return true;
  } catch {
    return false;
  }
}

export async function fetchMe(): Promise<boolean> {
  try {
    const r = await fetch("/api/me", { headers: { accept: "application/json" } });
    if (!r.ok) return false;
    hydrateMe(await r.json());
    return true;
  } catch {
    return false;
  }
}

export async function doAction(op: string, extra: Record<string, any> = {}): Promise<{ ok: boolean; msg: string }> {
  try {
    const r = await fetch("/api/me", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ op, _csrf: me.csrf, ...extra }),
    });
    const j = await r.json().catch(() => ({ ok: false, msg: "Network error." }));
    if (j.ok) await fetchMe();
    return j;
  } catch {
    return { ok: false, msg: "Network error." };
  }
}

export function visibleInventory(isOwner: boolean, isPublic: boolean) {
  return isOwner || isPublic;
}

export function profilePlayer(name: string) {
  return players.find((p) => p.name === name);
}
