import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Swords,
  Skull,
  Clock,
  Globe,
  Trophy,
  Shield,
  Heart,
  Drumstick,
  MapPin,
  ChevronRight,
  Search,
  Flame,
  EyeOff,
  CalendarDays,
  Star,
  Crosshair,
  Package,
  Gem,
  Lock,
  Gauge,
  Activity,  MemoryStick,
  Check,
  Flag,
  X,
  Shirt,
  Footprints,
  Pickaxe,
  Apple,
  Zap,
  Radio,
  Crown,
  MessageSquare,
  Compass,
  LogIn,
  Coins,
  Megaphone,
  Ban,
  Bell,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Square,
  Archive,
  Terminal,
  Folder,
  FileText,
  RefreshCw,
  Send,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, DiscordMark } from "./community-shell";
import {
  bounties,
  factions,
  feed,
  doAction,
  isLive,
  isDonor,
  liveVersion,
  subscribeLive,
  me,
  news,
  players,
  posts,
  profilePlayer,
  serverStatus,
  siteMeta,
  visibleInventory,
  zones,
  type Player,
} from "@/lib/community-data";
import world from "@/assets/shattered-world.jpg";

function Stats({
  values,
}: {
  values: { label: string; value: string; icon: typeof Users; note: string; tone?: string }[];
}) {
  return (
    <div className="stats-grid">
      {values.map((s) => (
        <div className="stat-tile" key={s.label}>
          <div className="stat-top">
            <span>{s.label}</span>
            <s.icon className={s.tone ?? ""} size={18} />
          </div>
          <strong>{s.value}</strong>
          <small>{s.note}</small>
        </div>
      ))}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  children?: React.ReactNode | undefined;
}) {
  return (
    <div className="page-heading">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div className="page-heading-row">
        <h1>{title}</h1>
        {children}
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function SectionHeading({
  title,
  to,
  label,
}: {
  title: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          {label} <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- overview
export function Overview() {
  const top = [...players].sort((a, b) => b.kills - a.kills).slice(0, 4);
  return (
    <>
      <PageHeading title="A world without rules." subtitle="Your world. Your rivals. Your legacy.">
        <span className="status-pill">
          <span className={`server-dot ${serverStatus.online ? "" : "offline"}`} />
          {serverStatus.configured
            ? serverStatus.online
              ? `${siteMeta.online} online`
              : "Server offline"
            : "Server not configured"}
          <span className="pill-divider" />
          {siteMeta.players} tracked
        </span>
      </PageHeading>
      <section className="world-cover">
        <img
          src={world}
          alt="Shattered SMP fortress overlooking a river and mountain world"
          width={1536}
          height={768}
        />
        <div className="cover-shade" />
        <div className="cover-content">
          <span className="cover-eyebrow">
            <span className="server-dot" /> THE WORLD IS YOURS
          </span>
          <h2>Shattered SMP</h2>
          <p>
            Some build empires.
            <br />
            Others bring them down.
          </p>
          <div className="cover-actions">
            <Button asChild>
              <Link to="/bounties">
                <Crosshair />
                Hunt the marked
                <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" asChild className="cover-secondary">
              <Link to="/players">
                Meet the players
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="cover-bottom">
          <span>
            <Globe size={14} /> Anarchy survival
          </span>
          <span>
            NO RESETS <span className="cover-dot">·</span> EVERY DEATH IS RECORDED
          </span>
        </div>
      </section>
      <Stats
        values={[
          {
            label: "Online now",
            value: String(siteMeta.online),
            icon: Users,
            note: serverStatus.configured ? `of ${serverStatus.playersMax || "?"} slots` : "Server not configured",
            tone: "text-jade",
          },
          {
            label: "Tracked players",
            value: siteMeta.players.toLocaleString(),
            icon: Globe,
            note: "Synced from the live feed",
          },
          {
            label: "Kills recorded",
            value: siteMeta.kills.toLocaleString(),
            icon: Swords,
            note: "Every death tells a story",
            tone: "text-rose",
          },
          {
            label: "Open bounties",
            value: String(bounties.length),
            icon: Crosshair,
            note: "Marked for death",
            tone: "text-gold",
          },
        ]}
      />
      <div className="overview-columns">
        <section>
          <SectionHeading title="The ones to watch" to="/leaderboards" label="Leaderboards" />
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>PLAYER</th>
                  <th>KILLS</th>
                  <th>HONOR</th>
                </tr>
              </thead>
              <tbody>
                {top.map((p, i) => (
                  <tr key={p.name}>
                    <td>
                      <span className={`rank-number ${i === 0 ? "first" : ""}`}>
                        {i === 0 ? <Crown size={17} /> : `0${i + 1}`}
                      </span>
                    </td>
                    <td>
                      <Link className="player-cell" to="/players/$name" params={{ name: p.name }}>
                        <Avatar player={p} />
                        <span>
                          <strong>{p.name}</strong>
                          <small>{p.faction}</small>
                        </span>
                      </Link>
                    </td>
                    <td className="number">{p.kills.toLocaleString()}</td>
                    <td>
                      <span className="ratio">{p.honor.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <SectionHeading title="Fresh from the world" to="/community" label="Community" />
          <div className="activity-panel">
            <div className="activity-label">
              <span className="server-dot" /> LIVE KILL FEED
            </div>
            {feed.length ? (
              feed.slice(0, 5).map((f, i) => (
                <div className="feed-item" key={i}>
                  <span className={`feed-icon ${i % 3 === 0 ? "rose" : i % 3 === 1 ? "gold" : "jade"}`}>
                    <Swords size={16} />
                  </span>
                  <div>
                    <p>
                      <strong>{f[0]}</strong>
                      <br />
                      <span className="text-rose">{f[1]}</span>
                    </p>
                    <small>
                      {f[2]} {f[2] && "·"} {f[3]}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No kills recorded yet. Be the first chapter.</div>
            )}
          </div>
        </section>
      </div>
      {news.length > 0 && (
        <>
          <SectionHeading title="News" to="/community" label="Community" />
          <div className="news-grid">
            {news.map((n, i) => (
              <Link
                key={i}
                to="/community"
                className={`news-card ${i === 0 ? "image-news" : "event-news"}`}
              >
                {i === 0 ? (
                  <img src={world} alt="Shattered world" loading="lazy" width={1536} height={768} />
                ) : (
                  <div className="event-art">
                    <Compass size={54} />
                    <span>{n.title.slice(0, 22).toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <span className="badge jade">ANNOUNCEMENT</span>
                  <h3>{n.title}</h3>
                  <p>{n.body.slice(0, 120)}…</p>
                  <small>
                    {n.author} · {n.time} <ArrowUpRight size={15} />
                  </small>
                </div>
              </Link>
            ))}
            <div className="world-note">
              <span className="eyebrow">NO RULES. REAL STORIES.</span>
              <Shield size={35} />
              <h3>
                Better together.
                <br />
                Dangerous apart.
              </h3>
              <p>
                Find your people. Form a faction.
                <br />
                Write your own chapter.
              </p>
              <Button variant="outline" asChild>
                <Link to="/factions">
                  Discover factions <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------- players
export function PlayersPage() {
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState(false);
  const filtered = players.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) && (!online || p.online),
  );
  return (
    <>
      <PageHeading
        eyebrow="THE PEOPLE BEHIND THE LEGENDS"
        title="Players"
        subtitle="Friends, rivals, and a few names you won't forget."
      />
      <div className="filter-row">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players…"
            aria-label="Search players"
          />
        </label>
        <Button variant={online ? "default" : "outline"} onClick={() => setOnline(!online)}>
          <span className="server-dot" />
          Online only
        </Button>
        <span className="results-count">{filtered.length} players</span>
      </div>
      <div className="player-grid">
        {filtered.map((p) => (
          <Link to="/players/$name" params={{ name: p.name }} key={p.name} className="player-card">
            <div className={`player-card-banner ${p.tone}`}>
              <Shield size={65} />
              <span className="badge">{p.online ? "Online" : "Offline"}</span>
            </div>
            <div className="player-card-body">
              <Avatar player={p} large />
              <span className={`badge ${p.tone}`}>{p.rank}</span>
              {p.owner && <span className="badge owner-badge">👑 OWNER</span>}
              {p.donor && <span className="badge donor-badge">💎 DONOR</span>}
              <h2>{p.name}</h2>
              <p>{p.faction}</p>
              <div className="player-card-stats">
                <span>
                  <strong>{p.kills.toLocaleString()}</strong>Kills
                </span>
                <span>
                  <strong>{p.honor.toLocaleString()}</strong>Honor
                </span>
                <span>
                  <strong>{p.streak}</strong>Streak
                </span>
              </div>
              <span className="profile-link">
                View profile
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && <div className="empty-state">No players match this search.</div>}
    </>
  );
}

// ---------------------------------------------------------------- profile
function Inventory({
  publicInventory = false,
  owner = false,
}: {
  publicInventory?: boolean;
  owner?: boolean;
}) {
  const show = visibleInventory(owner, publicInventory);
  return (
    <section className="inventory-panel">
      <SectionHeading title="Inventory & equipment" />
      {show ? (
        <div className="private-state">
          <EyeOff size={32} />
          <h3>Not available yet</h3>
          <p>Live inventory requires the plugin's snapshot feed. Coming with the next plugin update.</p>
        </div>
      ) : (
        <div className="private-state">
          <EyeOff size={32} />
          <h3>Inventory is private</h3>
          <p>This player hasn't shared their inventory.</p>
        </div>
      )}
    </section>
  );
}

export function ProfilePage({ name }: { name: string }) {
  const p = profilePlayer(name);
  const [tab, setTab] = useState("Overview");
  if (!p)
    return (
      <>
        <PageHeading title="Player not found" subtitle="This player isn't in the records yet." />
        <Button asChild>
          <Link to="/players">Back to players</Link>
        </Button>
      </>
    );
  const kd = p.deaths === 0 ? p.kills : (p.kills / p.deaths).toFixed(1);
  return (
    <>
      <div className="profile-cover">
        <img src={world} alt="Shattered world profile banner" width={1536} height={768} />
        {p.openBounties > 0 && <span className="badge gold">MARKED · {p.openBounties} bounty</span>}
      </div>
      <div className="profile-identity">
        <Avatar player={p} large />
        <div>
          <div className="profile-title">
            <h1>{p.name}</h1>
            {p.owner && <span className="badge owner-badge">👑 OWNER</span>}
            {p.donor && <span className="badge donor-badge">💎 DONOR</span>}
            <span className={`badge ${p.tone}`}>{p.rank} ✦</span>
          </div>
          <p>
            <Shield size={15} />
            {p.faction}
            <span>·</span>
            <span className={p.online ? "text-jade" : ""}>
              {p.online ? "Online now" : "Offline"}
            </span>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/factions">
            View faction <ArrowUpRight />
          </Link>
        </Button>
      </div>
      <div className="tabs">
        {["Overview", "Combat history", "Achievements"].map((t) => (
          <Button
            variant="ghost"
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
          <Stats
            values={[
              { label: "Total kills", value: p.kills.toLocaleString(), icon: Swords, note: `${kd} kill / death ratio` },
              { label: "Total deaths", value: String(p.deaths), icon: Skull, note: "Every death tells a story" },
              { label: "Honor", value: p.honor.toLocaleString(), icon: Star, note: "Earned. Never bought.", tone: "text-gold" },
              { label: "Playtime", value: `${p.hours}h`, icon: Clock, note: "Synced from the server" },
            ]}
          />
          <div className="profile-columns">
            <section>
              <SectionHeading title="Current player state" />
              <div className="vitals-panel">
                <div className="vital-row">
                  <span>
                    <Heart size={17} />
                    Health
                  </span>
                  <div className="vital-icons health">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Heart size={20} className={i > 7 ? "empty" : ""} key={i} />
                    ))}
                  </div>
                  <strong>— / 20</strong>
                </div>
                <div className="vital-row">
                  <span>
                    <Drumstick size={17} />
                    Hunger
                  </span>
                  <div className="vital-icons hunger">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Drumstick size={20} className={i > 8 ? "empty" : ""} key={i} />
                    ))}
                  </div>
                  <strong>— / 20</strong>
                </div>
                <p className="subtle-note">
                  Live vitals arrive with the plugin's player-state feed.
                </p>
              </div>
              <Inventory publicInventory={false} />
            </section>
            <aside className="profile-facts">
              <SectionHeading title="The story so far" />
              {[
                [MapPin, "Last coordinates", "Hidden by player"],
                [Globe, "Dimension", "Not shared"],
                [Trophy, "Kill streak", `${p.streak} alive`],
                [Crosshair, "Bounties claimed", String(p.bountyClaims)],
                [Zap, "Currently marked", p.openBounties > 0 ? `${p.openBounties} bounty on their head` : "Not marked"],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof MapPin;
                return (
                  <div className="fact-row" key={String(label)}>
                    <I size={17} />
                    <span>
                      {String(label)}
                      <strong>{String(value)}</strong>
                    </span>
                  </div>
                );
              })}
              {p.bountyClaims >= 3 && <span className="badge gold">✦ Bounty Hunter</span>}
              {p.openBounties >= 2 && <span className="badge rose">☠ Most Wanted</span>}
              {p.deaths === 0 && p.kills >= 5 && <span className="badge jade">◇ Immortal</span>}
            </aside>
          </div>
        </>
      )}
      {tab === "Combat history" && (
        <>
          <Stats
            values={[
              { label: "Kill / death ratio", value: String(kd), icon: Swords, note: "All-time combat record" },
              { label: "Longest streak", value: String(p.streak), icon: Flame, note: "From the kill feed" },
              { label: "Bounties claimed", value: String(p.bountyClaims), icon: Crosshair, note: "Honor earned: +" + p.bountyClaims * 50 },
              { label: "Open bounties", value: String(p.openBounties), icon: Skull, note: p.openBounties ? "Someone wants them dead" : "Not marked", tone: "text-rose" },
            ]}
          />
          <div className="profile-columns">
            <section>
              <SectionHeading title="Kill & death timeline" />
              {feed.length ? (
                feed.slice(0, 6).map((f, i) => (
                  <div className="combat-event" key={i}>
                    <span className={`feed-icon ${i % 2 ? "jade" : "rose"}`}>
                      <Swords size={18} />
                    </span>
                    <div>
                      <strong>{f[0]}</strong>
                      <p>
                        {f[1]} · {f[2] || "unknown location"}
                      </p>
                      <small>{f[3]}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No combat recorded yet.</div>
              )}
            </section>
            <aside>
              <SectionHeading title="Rivals" />
              {players
                .filter((r) => r.name !== p.name)
                .slice(0, 3)
                .map((r) => (
                  <Link
                    className="rival-row"
                    key={r.name}
                    to="/players/$name"
                    params={{ name: r.name }}
                  >
                    <Avatar player={r} />
                    <div>
                      <strong>{r.name}</strong>
                      <small>{r.faction}</small>
                    </div>
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
            </aside>
          </div>
        </>
      )}
      {tab === "Achievements" && (
        <div className="achievement-grid">
          {[
            { title: "First Blood", desc: "Record a kill", done: p.kills >= 1 },
            { title: "Slayer", desc: "25 recorded kills", done: p.kills >= 25 },
            { title: "Deathless", desc: "5 kills, zero deaths", done: p.kills >= 5 && p.deaths === 0 },
            { title: "Bounty Hunter", desc: "Claim 3 bounties", done: p.bountyClaims >= 3 },
            { title: "Most Wanted", desc: "Have 2 bounties on your head", done: p.openBounties >= 2 },
            { title: "Veteran", desc: "100 hours in the world", done: p.hours >= 100 },
          ].map((a) => (
            <div className={`achievement-card ${a.done ? "unlocked" : ""}`} key={a.title}>
              {a.done ? <Crown size={30} /> : <Lock size={30} />}
              <span className={`badge ${a.done ? "jade" : "gold"}`}>{a.done ? "Unlocked" : "Locked"}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------- leaderboards
export function LeaderboardsPage() {
  const [category, setCategory] = useState("Most kills");
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(false);
  const categories = ["Most kills", "Most deaths", "Kill streak", "Honor", "Bounty claims", "Playtime", "Top factions"];
  const value = (p: Player) =>
    category === "Most deaths"
      ? p.deaths
      : category === "Kill streak"
        ? p.streak
        : category === "Honor"
          ? p.honor
          : category === "Bounty claims"
            ? p.bountyClaims
            : category === "Playtime"
              ? p.hours
              : p.kills;
  const sorted = [...players]
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (ascending ? value(a) - value(b) : value(b) - value(a)));
  return (
    <>
      <PageHeading
        eyebrow="EARNED. NEVER GIVEN."
        title="Leaderboards"
        subtitle="The names that shaped the world."
      />
      <div className="tabs wrap-tabs">
        {categories.map((c) => (
          <Button
            variant="ghost"
            className={c === category ? "selected" : ""}
            key={c}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="filter-row">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Filter rankings"
            placeholder="Find a player…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Button variant="outline" onClick={() => setAscending(!ascending)}>
          Sort {ascending ? "ascending" : "descending"}
        </Button>
      </div>
      {category === "Top factions" ? (
        <FactionList />
      ) : (
        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>RANK</th>
                <th>PLAYER</th>
                <th>{category.toUpperCase()}</th>
                <th>FACTION</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.name}>
                  <td>
                    <span className={`rank-number ${i === 0 ? "first" : ""}`}>
                      {i === 0 ? <Crown size={20} /> : i + 1}
                    </span>
                  </td>
                  <td>
                    <Link className="player-cell" to="/players/$name" params={{ name: p.name }}>
                      <Avatar player={p} />
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.rank}</small>
                      </span>
                    </Link>
                  </td>
                  <td className="number">
                    {value(p).toLocaleString()}
                    {category === "Playtime" ? "h" : ""}
                  </td>
                  <td>{p.faction}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!sorted.length && <div className="empty-state">No matching players.</div>}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------- factions
function FactionList() {
  return (
    <div className="faction-grid">
      {factions.map((c, i) => (
        <Link to="/factions/$name" params={{ name: c.name }} className="faction-card" key={c.name}>
          <div className={`faction-symbol ${c.tone}`}>
            <Shield size={42} />
            <span>{c.tag}</span>
          </div>
          <span className="eyebrow">RANK #{i + 1}</span>
          <h2>{c.name}</h2>
          <p>{c.description}</p>
          <div className="player-card-stats">
            <span>
              <strong>{c.members}</strong>Members
            </span>
            <span>
              <strong>{c.kills.toLocaleString()}</strong>Kills
            </span>
          </div>
          <span className="profile-link">
            View faction
            <ArrowUpRight size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function FactionsPage() {
  return (
    <>
      <PageHeading
        eyebrow="LOYALTY IS A CHOICE"
        title="Factions & teams"
        subtitle="Find your people. Build something worth defending. Create yours on Discord with /faction create — owners manage it here."
      />
      {factions.length ? (
        <FactionList />
      ) : (
        <div className="empty-state">No factions yet. Create the first one from your dashboard once you're signed in.</div>
      )}
    </>
  );
}

export function FactionPage({ name }: { name: string }) {
  const c = factions.find((c) => c.name === name);
  if (!c)
    return <PageHeading title="Faction not found" subtitle="Try another faction in the directory." />;
  const members = players.filter((p) => p.faction === c.name);
  return (
    <>
      <PageHeading eyebrow={c.tag} title={c.name} subtitle={c.description} />
      <Stats
        values={[
          { label: "Members", value: String(c.members), icon: Users, note: "Linked Discord roster" },
          { label: "Total kills", value: c.kills.toLocaleString(), icon: Swords, note: "Recorded faction combat" },
          { label: "Managed", value: c.name ? "Web + Discord" : "", icon: Shield, note: "Owner edits sync everywhere" },
        ]}
      />
      <SectionHeading title="Members" />
      <div className="member-list">
        {members.length ? (
          members.map((p) => (
            <Link to="/players/$name" params={{ name: p.name }} className="rival-row" key={p.name}>
              <Avatar player={p} />
              <div>
                <strong>{p.name}</strong>
                <small>
                  {p.rank} · {p.online ? "Online" : "Offline"}
                </small>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            No linked members yet. Members appear once their Discord and Minecraft accounts are connected.
          </div>
        )}
      </div>
      {me.faction?.name === c.name && me.faction?.isOwner && (
        <div className="subtle-note">
          You own this faction — manage it from <Link to="/dashboard">your dashboard</Link>.
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------- bounties
export function BountiesPage() {
  const [target, setTarget] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const r = await doAction("bounty", { target });
    setOk(r.ok);
    setMsg(r.msg);
    if (r.ok) {
      setTarget("");
      window.location.reload();
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="MARKED FOR DEATH"
        title="Bounty board"
        subtitle="No economy here — bounties are paid in Honor. Posting costs 100 Honor; the killer claims the mark."
      />
      <Stats
        values={[
          { label: "Open bounties", value: String(bounties.length), icon: Crosshair, note: "Currently marked", tone: "text-rose" },
          { label: "Bounty cost", value: "100 Honor", icon: Star, note: "Posting price — keeps the board honest", tone: "text-gold" },
          { label: "Claim reward", value: "+50 Honor", icon: Trophy, note: "Plus the kill itself", tone: "text-jade" },
        ]}
      />
      <div className="overview-columns">
        <section>
          <SectionHeading title="The marked" />
          <div className="discussion-list">
            {bounties.length ? (
              bounties.map((b) => (
                <div className="discussion" key={b.id}>
                  <span className="discussion-icon rose">
                    <Crosshair size={22} />
                  </span>
                  <div>
                    <span className="badge rose">MARKED</span>
                    <h2>{b.target}</h2>
                    <p>
                      Posted by {b.poster} · {b.time}
                    </p>
                  </div>
                  <span className="reply-count gold">
                    <Star size={15} />
                    {b.reward}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Crosshair size={32} />
                <h3>Nobody is marked right now</h3>
                <p>A quiet world is a boring world.</p>
              </div>
            )}
          </div>
        </section>
        <aside>
          <SectionHeading title="Post a bounty" />
          {me.logged ? (
            <form className="settings-form" onSubmit={post}>
              {me.linked ? (
                <>
                  <label>
                    Target player
                    <input
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="Exact Minecraft name"
                      maxLength={24}
                      required
                    />
                  </label>
                  <Button type="submit" className="btn-rose">
                    <Crosshair size={16} /> Mark them · -100 Honor
                  </Button>
                  {msg && <p className={`subtle-note ${ok ? "text-jade" : "text-rose"}`}>{msg}</p>}
                </>
              ) : (
                <div className="private-state">
                  <Lock size={24} />
                  <h3>Link your Minecraft account first</h3>
                  <p>
                    Run /link in-game or on Discord, then come back. Bounties need a linked
                    account so Honor can be earned.
                  </p>
                </div>
              )}
            </form>
          ) : (
            <div className="private-state">
              <LogIn size={24} />
              <h3>Sign in to post bounties</h3>
              <p>You need a linked Discord + Minecraft account to mark a target.</p>
              <Button asChild className="btn-discord">
                <a href="/auth/discord"><DiscordMark size={16} /> Sign in with Discord</a>
              </Button>
            </div>
          )}
          <SectionHeading title="Death zones" />
          <div className="discussion-list">
            {zones.length ? (
              zones.map((z, i) => (
                <div className="discussion" key={i}>
                  <span className="discussion-icon rose">
                    <Skull size={22} />
                  </span>
                  <div>
                    <span className="badge rose">DANGER</span>
                    <h2>{z.label}</h2>
                    <p>{z.count} recorded deaths in this area</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No death zones recorded yet.</div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- community
export function CommunityPage() {
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(false);
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await doAction("post", { body });
    setMsg(r.msg);
    if (r.ok) {
      setBody("");
      window.location.reload();
    }
  };
  return (
    <>
      <PageHeading title="Community" subtitle="The world doesn't end when you log off.">
        <Button variant="outline" onClick={() => setForm(true)}>
          <Flag />
          Reports & appeals
        </Button>
      </PageHeading>
      <div className="discussion-list">
        {posts.length ? (
          posts.map((p) => (
            <Link
              className="discussion"
              to="/community/$postId"
              params={{ postId: p.id }}
              key={p.id}
            >
              <span className="discussion-icon">
                <MessageSquare size={22} />
              </span>
              <div>
                <span className="badge jade">{p.category}</span>
                <h2>{p.title}</h2>
                <p>
                  {p.author} · {p.time}
                </p>
              </div>
              <ChevronRight size={18} />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <MessageSquare size={32} />
            <h3>No posts yet</h3>
            <p>Be the first voice in the wasteland.</p>
          </div>
        )}
      </div>
      <SectionHeading title={me.logged ? "Say something" : "Join the conversation"} />
      {me.logged ? (
        <form className="settings-form" onSubmit={send}>
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Word travels fast in an anarchy…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <div className="filter-row">
            <Button type="submit">Post to the wall</Button>
            <span className="results-count">{msg}</span>
          </div>
        </form>
      ) : (
        <div className="private-state">
          <LogIn size={24} />
          <h3>Sign in to post</h3>
          <p>Discord accounts only. 30 seconds between posts, mods remove garbage.</p>
          <Button asChild className="btn-discord">
            <a href="/auth/discord"><DiscordMark size={16} /> Sign in with Discord</a>
          </Button>
        </div>
      )}
      {form && <ReportModal close={() => setForm(false)} />}
    </>
  );
}

function ReportModal({ close }: { close: () => void }) {
  const [type, setType] = useState("Ban appeal");
  const [mcName, setMcName] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await doAction("appeal", { punishment: type, mc_name: mcName, reason });
    setMsg(r.msg);
    if (r.ok) {
      setMcName("");
      setReason("");
    }
  };
  return (
    <div className="modal-backdrop">
      <section className="snapshot-modal">
        <div className="section-heading">
          <h2>Reports & appeals</h2>
          <Button variant="ghost" size="icon" aria-label="Close report form" onClick={close}>
            <X />
          </Button>
        </div>
        {me.logged ? (
          <form className="settings-form" onSubmit={send}>
            <label>
              Category
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Ban appeal</option>
                <option>Mute appeal</option>
                <option>Kick appeal</option>
                <option>Other punishment</option>
              </select>
            </label>
            <label>
              Your Minecraft name
              <input value={mcName} onChange={(e) => setMcName(e.target.value)} maxLength={24} required />
            </label>
            <label>
              What happened
              <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={1000} required />
            </label>
            <Button type="submit">Submit to staff</Button>
            {msg && <p className="subtle-note">{msg}</p>}
          </form>
        ) : (
          <div className="private-state">
            <LogIn size={24} />
            <h3>Sign in first</h3>
            <p>Appeals need a Discord account so staff can reach you.</p>
            <Button asChild className="btn-discord">
              <a href="/auth/discord"><DiscordMark size={16} /> Sign in with Discord</a>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export function PostPage({ id }: { id: string }) {
  const post = posts.find((p) => p.id === id);
  return (
    <>
      <Button variant="ghost" asChild>
        <Link to="/community">← Community</Link>
      </Button>
      <PageHeading
        eyebrow={post?.category}
        title={post?.title ?? "Discussion not found"}
        subtitle={post ? `${post.author} · ${post.time}` : "This discussion is unavailable."}
      />
      {post && (
        <article className="article-body">
          <p>{post.body}</p>
        </article>
      )}
    </>
  );
}

// ---------------------------------------------------------------- dashboard
type OwnerDashData = {
  stats: { players: number; linked: number; openBounties: number; openAppeals: number; donations30d: number };
  donations: { id: number; who: string; amount: number; time: string }[];
  appeals: { id: number; mcName: string; discordId: string; punishment: string; reason: string; status: string; resolution: string; time: string }[];
  bounties: { id: string; target: string; poster: string; reward: number; time: string }[];
  announcements: { id: number; author: string; body: string; posted: boolean; time: string }[];
};

const DASH_TAB_ICONS: Record<string, typeof Users> = {
  Overview: Activity,
  Account: Lock,
  Privacy: EyeOff,
  Faction: Shield,
  Bounties: Crosshair,
  Notifications: Bell,
  Appeals: Ban,
  "Owner console": Crown,
};

export function DashboardPage() {
  // re-render in place when live/session data refreshes (no remount)
  useSyncExternalStore(subscribeLive, liveVersion, () => 0);
  const [tab, setTab] = useState("Overview");
  const [msg, setMsg] = useState("");
  const [publicProfile, setPublicProfile] = useState(true);
  const [publicInv, setPublicInv] = useState(false);
  const [desc, setDesc] = useState(me.faction?.description || "");
  const [tag, setTag] = useState(me.faction?.tag || "");
  const [announce, setAnnounce] = useState("");
  const [appealName, setAppealName] = useState("");
  const [linkCode, setLinkCode] = useState("");
  const [donDiscord, setDonDiscord] = useState("");
  const [donName, setDonName] = useState("");
  const [donAmt, setDonAmt] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [bdayMonth, setBdayMonth] = useState("");
  const [bdayDay, setBdayDay] = useState("");
  const [bountyTarget, setBountyTarget] = useState("");
  const [wallDraft, setWallDraft] = useState("");
  const [annDraft, setAnnDraft] = useState("");
  const [ownerDash, setOwnerDash] = useState<OwnerDashData | null>(null);
  const [myBts, setMyBts] = useState<{ id: string; target: string; reward: number; time: string }[]>([]);

  useEffect(() => {
    setDesc(me.faction?.description || "");
    setTag(me.faction?.tag || "");
  }, [me.faction?.description, me.faction?.tag]);

  const run = async (op: string, extra: Record<string, any> = {}, reload = false) => {
    const r = await doAction(op, extra);
    setMsg(r.msg);
    if (r.ok && reload) setTimeout(() => window.location.reload(), 700);
    return r;
  };

  const loadMyBts = async () => {
    const r = await doAction("my_bounties");
    if (r.ok && r.data?.bounties) setMyBts(r.data.bounties);
  };
  const loadOwner = async () => {
    const r = await doAction("owner_dash");
    if (r.ok && r.data) { setOwnerDash(r.data); return; }
    setMsg(r.msg || "Could not load owner console data.");
  };

  useEffect(() => {
    if (me.logged) loadMyBts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.logged]);
  useEffect(() => {
    if (tab === "Owner console" && me.admin && !ownerDash) loadOwner().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (!me.logged)
    return (
      <>
        <PageHeading
          title="Your corner of the world."
          subtitle="Sign in to manage your account, privacy, bounties and faction."
        />
        <div className="private-state" style={{ maxWidth: 420 }}>
          <LogIn size={28} />
          <h3>Sign in with Discord</h3>
          <p>
            Your Discord session maps to your Minecraft account through the bot's link system, so
            everything here stays in sync.
          </p>
          <Button asChild className="btn-discord">
            <a href="/auth/discord"><DiscordMark size={16} /> Sign in with Discord</a>
          </Button>
        </div>
      </>
    );

  const donorDaysLeft = Math.max(0, (me.donorUntil - Date.now() / 1000) / 86400);
  const myPlayer = me.mcName ? profilePlayer(me.mcName) : undefined;
  const kd = me.stats && me.stats.deaths > 0 ? (me.stats.kills / me.stats.deaths).toFixed(2) : me.stats ? String(me.stats.kills) : "—";

  const roleBadge = me.admin ? (
    <span className="badge gold"><Crown size={12} /> OWNER</span>
  ) : isDonor() ? (
    <span className="badge gold"><Gem size={12} /> DONOR · {Math.ceil(donorDaysLeft)}d</span>
  ) : (
    <span className="badge jade">MEMBER</span>
  );

  const tabs = ["Overview", "Account", "Privacy", ...(me.faction ? ["Faction"] : []), "Bounties", "Notifications", "Appeals", ...(me.admin ? ["Owner console"] : [])];

  return (
    <>
      <div className="dash-hero">
        <div className="dash-hero-avatar">
          {myPlayer ? <Avatar player={myPlayer} large /> : me.avatar ? (
            <span className="pixel-avatar large has-img"><img src={me.avatar} alt="" /></span>
          ) : (
            <span className="pixel-avatar iron large"><span className="pixel-eyes" /><span className="pixel-mouth" /></span>
          )}
        </div>
        <div className="dash-hero-main">
          <h1>{me.mcName || me.username}</h1>
          <div className="dash-hero-badges">
            {roleBadge}
            {me.faction && <span className="badge violet">{me.faction.tag} · {me.faction.name}</span>}
            {me.linked
              ? <span className="badge jade"><Check size={12} /> MC LINKED</span>
              : <span className="badge iron">NOT LINKED</span>}
          </div>
          <p>
            {me.linked
              ? "Accounts synced — everything below is live from the server."
              : "Run /link in-game to unlock stats, bounties and faction tools."}
          </p>
        </div>
        <Link to="/status" className={`dash-hero-status ${serverStatus.online ? "up" : ""}`}>
          <Radio size={16} />
          <strong>{serverStatus.online ? "Server online" : serverStatus.configured ? "Server offline" : "Server not configured"}</strong>
          <small>
            {serverStatus.online
              ? `${serverStatus.playersOnline}/${serverStatus.playersMax || "?"} playing${serverStatus.tps != null ? ` · ${serverStatus.tps.toFixed(1)} TPS` : ""}`
              : serverStatus.configured
                ? "No heartbeat from the server right now"
                : "Waiting for the plugin heartbeat"}
          </small>
        </Link>
      </div>

      <div className="tabs dash-tabs" role="tablist">
        {tabs.map((t) => {
          const TabIcon = DASH_TAB_ICONS[t] ?? Activity;
          return (
            <Button
              variant="ghost"
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? "selected" : ""}
              onClick={() => { setTab(t); setMsg(""); }}
              key={t}
            >
              <TabIcon size={14} /> {t}
            </Button>
          );
        })}
      </div>
      {msg && <div className="dash-msg" role="status">{msg}</div>}

      <div className="dash-body">

      {tab === "Overview" && (
        <>
          <Stats
            values={
              me.stats
                ? [
                    { label: "Kills", value: String(me.stats.kills), icon: Swords, note: `Streak: ${me.stats.streak} · best ${me.stats.bestStreak}` },
                    { label: "Deaths", value: String(me.stats.deaths), icon: Skull, note: `K/D ratio: ${kd}` },
                    { label: "Honor", value: me.stats.honor.toLocaleString(), icon: Star, note: "Earned, never bought", tone: "text-gold" },
                    { label: "Playtime", value: `${me.stats.hours}h`, icon: Clock, note: `${me.stats.chunks} chunks explored` },
                  ]
                : [{ label: "No stats yet", value: "—", icon: Package, note: "Link your Minecraft account to appear" }]
            }
          />
          <div className="dash-two-col">
            <div className="settings-form">
              <h2>Mark a bounty.</h2>
              <p>Rewards are auto-priced from the target's stats — dangerous players cost more. −100 Honor from you when it's claimed.</p>
              <div className="link-claim-row">
                <input
                  className="link-code-input"
                  placeholder="Target player name"
                  value={bountyTarget}
                  maxLength={16}
                  onChange={(e) => setBountyTarget(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && bountyTarget.trim()) { run("bounty", { target: bountyTarget.trim() }); setBountyTarget(""); } }}
                />
                <Button disabled={!bountyTarget.trim()} onClick={() => { run("bounty", { target: bountyTarget.trim() }); setBountyTarget(""); }}>
                  <Crosshair size={16} /> Post bounty
                </Button>
              </div>
              <h2>Post to the wall.</h2>
              <textarea rows={2} maxLength={1000} placeholder="Say something to the realm…" value={wallDraft} onChange={(e) => setWallDraft(e.target.value)} />
              <Button disabled={!wallDraft.trim()} onClick={() => { run("post", { body: wallDraft.trim() }); setWallDraft(""); }}>
                <MessageSquare size={16} /> Post
              </Button>
            </div>
            <div className="settings-form">
              <h2>Recent activity.</h2>
              {feed.length ? feed.slice(0, 7).map((f, i) => (
                <div className="dash-feed-row" key={i}>
                  <Swords size={14} />
                  <span>{f[0] === "—" ? "The void" : f[0]} <em>took down</em> {f[1]}</span>
                  <small>{f[3]}</small>
                </div>
              )) : (
                <div className="empty-state"><Activity size={28} /><h3>No blood yet</h3><p>Kills appear here as they happen in-game.</p></div>
              )}
              {myBts.length > 0 && (
                <>
                  <h2>Your marks ({myBts.length}).</h2>
                  {myBts.slice(0, 4).map((b) => (
                    <div className="dash-feed-row" key={b.id}>
                      <Crosshair size={14} />
                      <span>{b.target} · <em>{b.reward} Honor</em></span>
                      <button className="link-cancel" onClick={() => { run("bounty_cancel", { id: Number(b.id) }); setTimeout(loadMyBts, 600); }}>cancel</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "Account" && (
        <>
          <div className="settings-form">
            {[
              ["Discord account", me.username ?? "—", "Signed in"],
              ["Minecraft account", me.mcName ?? "Not linked", me.linked ? "Verified via /link" : "Run /link in-game"],
              ["Donor status", isDonor() ? `Ad-free · ${Math.ceil(donorDaysLeft)} days left` : "Not a donor", "30 days ad-free per donation"],
            ].map(([t, d, s]) => (
              <div className="security-row" key={t}>
                <Lock size={20} />
                <div>
                  <strong>{t}</strong>
                  <p>{d} · <span className="muted">{s}</span></p>
                </div>
              </div>
            ))}
          </div>
          <div className="settings-form">
            <h2>Avatar &amp; birthday.</h2>
            <p>Your card shows your current avatar. Upload your own and set your birthday so the server celebrates you. Only day + month are stored.</p>
            <div className="link-claim-row">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const dataUrl = await new Promise<string>((res, rej) => {
                    const img = new Image();
                    const fr = new FileReader();
                    fr.onload = () => { img.onload = () => {
                      const c = document.createElement("canvas");
                      c.width = c.height = 128;
                      const ctx = c.getContext("2d")!;
                      ctx.imageSmoothingEnabled = false;
                      ctx.drawImage(img, 0, 0, 128, 128);
                      res(c.toDataURL("image/png"));
                    };
                    img.onerror = rej;
                    img.src = String(fr.result);
                  };
                  fr.readAsDataURL(f);
                }).catch(() => "");
                  if (dataUrl) await run("set_avatar", { avatar: dataUrl });
                }}
              />
            </div>
            <div className="link-claim-row">
              <select className="link-code-input" defaultValue="" onChange={(e) => setBdayMonth(e.target.value)} aria-label="Month">
                <option value="">Month…</option>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select className="link-code-input" defaultValue="" onChange={(e) => setBdayDay(e.target.value)} aria-label="Day">
                <option value="">Day…</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Button
                disabled={!bdayMonth || !bdayDay}
                onClick={() => run("birthday", { month: Number(bdayMonth), day: Number(bdayDay) })}
              >
                Save birthday
              </Button>
            </div>
          </div>
          {!me.linked && (
            <div className="link-claim">
              <h3>Link your Minecraft account</h3>
              <p>Run <code>/link</code> in-game or on Discord to get a 6-character code, then enter it here to sync your stats, bounties and faction tools.</p>
              <div className="link-claim-row">
                <input
                  className="link-code-input"
                  maxLength={6}
                  placeholder="ABC123"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                />
                <Button onClick={() => run("link_claim", { code: linkCode }, true)}>Link account</Button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "Privacy" && (
        <div className="settings-form">
          <h2>Your information, your choice.</h2>
          <label className="check-row">
            <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />
            Public profile
          </label>
          <label className="check-row">
            <input type="checkbox" checked={publicInv} onChange={(e) => setPublicInv(e.target.checked)} />
            Public inventory
          </label>
          <p className="subtle-note">Live coordinates are never exposed publicly, regardless of these settings.</p>
          <Button onClick={() => run("privacy", { profile_public: publicProfile, inventory_public: publicInv })}>
            Save privacy settings
          </Button>
          <Inventory publicInventory={publicInv} owner={me.mcName !== null} />
        </div>
      )}

      {tab === "Faction" &&
        (me.faction ? (
          <div className="settings-layout">
            <form className="settings-form">
              <h2>{me.faction.name} {me.faction.isOwner && "· owner controls"}</h2>
              {!me.faction.isOwner ? (
                <p className="subtle-note">
                  You're a {me.faction.role || "member"} of {me.faction.name}. Only the owner can edit the faction from the web.
                </p>
              ) : (
                <>
                  <label>
                    Tag
                    <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={8} />
                  </label>
                  <label>
                    Description
                    <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={300} />
                  </label>
                  <Button onClick={() => run("faction_edit", { description: desc, tag })}>
                    <Check size={16} /> Save faction
                  </Button>
                  <h2>Announce</h2>
                  <label>
                    Faction announcement (mirrors to your Discord channel and in-game)
                    <textarea rows={2} value={announce} onChange={(e) => setAnnounce(e.target.value)} maxLength={300} />
                  </label>
                  <Button onClick={() => run("faction_announce", { body: announce })}>
                    <Megaphone size={16} /> Post announcement
                  </Button>
                  <h2>Members</h2>
                  {me.factionMembers.map((m) => (
                    <div className="security-row" key={m.discordId}>
                      <Users size={18} />
                      <div>
                        <strong>{m.mcName || "Discord member"}</strong>
                        <p>{m.role}</p>
                      </div>
                      {m.discordId !== me.csrf && m.discordId !== me.username && (
                        <Button variant="outline" onClick={() => run("faction_kick", { discord_id: m.discordId })}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <h2>Danger zone</h2>
                  <Button variant="outline" className="btn-rose" onClick={() => run("faction_disband", {}, true)}>
                    Disband faction
                  </Button>
                </>
              )}
            </form>
          </div>
        ) : (
          <div className="empty-state">
            <Shield size={32} />
            <h3>You're not in a faction yet</h3>
            <p>Create one on Discord with /faction create (requires chat level 50).</p>
          </div>
        ))}

      {tab === "Bounties" && (
        <div className="settings-form">
          <h2>Post a mark.</h2>
          <p>Rewards are auto-priced from the target's stats. You lose 100 Honor if someone claims it — post wisely.</p>
          <div className="link-claim-row">
            <input
              className="link-code-input"
              placeholder="Target player name"
              value={bountyTarget}
              maxLength={16}
              onChange={(e) => setBountyTarget(e.target.value)}
            />
            <Button
              disabled={!bountyTarget.trim()}
              onClick={() => { run("bounty", { target: bountyTarget.trim() }); setBountyTarget(""); setTimeout(loadMyBts, 600); }}
            >
              <Crosshair size={16} /> Post bounty
            </Button>
          </div>
          <h2>Your open marks ({myBts.length}).</h2>
          {myBts.length ? myBts.map((b) => (
            <div className="dash-feed-row" key={b.id}>
              <Crosshair size={14} />
              <span><strong>{b.target}</strong> · {b.reward} Honor · posted {b.time}</span>
              <button className="link-cancel" onClick={() => { run("bounty_cancel", { id: Number(b.id) }); setTimeout(loadMyBts, 600); }}>cancel</button>
            </div>
          )) : (
            <div className="empty-state"><Crosshair size={28} /><h3>No marks yet</h3><p>Your open bounties show here with a cancel button.</p></div>
          )}
        </div>
      )}

      {tab === "Notifications" && (
        <div className="settings-form">
          <h2>What happened while you were away.</h2>
          {me.notifications.length ? (
            me.notifications.map((n) => (
              <div className="combat-event" key={n.id}>
                <span className={`feed-icon ${n.kind === "bounty" ? "gold" : "rose"}`}>
                  {n.kind === "bounty" ? <Crosshair size={18} /> : <Swords size={18} />}
                </span>
                <div>
                  <strong>{n.kind === "bounty" ? "Bounty news" : n.kind === "appeal" ? "Appeal result" : n.kind === "faction" ? "Faction" : "Revenge"}</strong>
                  <p>{n.body}</p>
                  <small>{n.time}</small>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Bell size={32} />
              <h3>Nothing yet</h3>
              <p>Bounty claims, appeal results and faction news land here.</p>
            </div>
          )}
          {me.notifications.length > 0 && <Button onClick={() => run("notifs_read", {}, true)}>Mark all read</Button>}
        </div>
      )}

      {tab === "Appeals" && (
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            run("appeal", { punishment: "ban", mc_name: appealName, reason: appealReason });
          }}
        >
          <h2>
            <Ban size={16} /> Appeal a punishment
          </h2>
          <label>
            Your Minecraft name
            <input value={appealName} onChange={(e) => setAppealName(e.target.value)} maxLength={24} required />
          </label>
          <label>
            What happened
            <textarea rows={4} value={appealReason} onChange={(e) => setAppealReason(e.target.value)} maxLength={1000} required />
          </label>
          <Button type="submit">Submit to staff</Button>
        </form>
      )}

      {tab === "Owner console" && me.admin && (
        !ownerDash ? (
          <div className="settings-form">
            <h2>Owner console.</h2>
            <p className="subtle-note">Loading… <button className="link-cancel" onClick={() => loadOwner()}>retry</button></p>
          </div>
        ) : (
        <>
          <div className="owner-chips">
            <div className="owner-chip"><Users size={16} /><strong>{ownerDash.stats.players}</strong><small>players</small></div>
            <div className="owner-chip"><Check size={16} /><strong>{ownerDash.stats.linked}</strong><small>linked</small></div>
            <div className="owner-chip"><Crosshair size={16} /><strong>{ownerDash.stats.openBounties}</strong><small>open marks</small></div>
            <div className="owner-chip"><Ban size={16} /><strong>{ownerDash.stats.openAppeals}</strong><small>appeals</small></div>
            <div className="owner-chip"><Coins size={16} /><strong>{ownerDash.stats.donations30d.toLocaleString()}</strong><small>donated (30d)</small></div>
          </div>

          <div className="dash-two-col">
            <div className="settings-form">
              <h2><Megaphone size={16} /> Server announcement.</h2>
              <p>Posts to #announcements through the bot within seconds. Signed with your name.</p>
              <textarea rows={3} maxLength={500} placeholder="What does the realm need to know?" value={annDraft} onChange={(e) => setAnnDraft(e.target.value)} />
              <Button disabled={!annDraft.trim()} onClick={() => { run("site_announce", { body: annDraft.trim() }); setAnnDraft(""); setTimeout(loadOwner, 900); }}>
                <Megaphone size={16} /> Queue announcement
              </Button>
              <h2>Recent</h2>
              {ownerDash.announcements.length ? ownerDash.announcements.map((a) => (
                <div className="dash-feed-row" key={a.id}>
                  <Megaphone size={14} />
                  <span>{a.body.slice(0, 70)}<em> · {a.author}</em></span>
                  <small>{a.posted ? "posted" : "queued"} · {a.time}</small>
                </div>
              )) : <p className="subtle-note">No announcements yet.</p>}
            </div>

            <div className="settings-form">
              <h2><Coins size={16} /> Donations.</h2>
              <p>Record a donation to give the 💎 DONOR badge for 30 days.</p>
              <div className="link-claim-row">
                <input className="link-code-input" placeholder="Discord ID" value={donDiscord} onChange={(e) => setDonDiscord(e.target.value.trim())} />
                <input className="link-code-input" placeholder="or MC name" value={donName} onChange={(e) => setDonName(e.target.value)} />
              </div>
              <div className="link-claim-row">
                <input className="link-code-input" type="number" placeholder="Amount" value={donAmt} onChange={(e) => setDonAmt(e.target.value)} />
                <Button onClick={() => { run("record_donation", { discord_id: donDiscord, mc_name: donName, amount: donAmt }); setDonDiscord(""); setDonName(""); setDonAmt(""); setTimeout(loadOwner, 900); }}>
                  Record
                </Button>
              </div>
              <h2>Recent</h2>
              {ownerDash.donations.length ? ownerDash.donations.map((d) => (
                <div className="dash-feed-row" key={d.id}>
                  <Coins size={14} />
                  <span><strong>{d.who}</strong> · {d.amount.toLocaleString()}</span>
                  <small>{d.time}</small>
                </div>
              )) : <p className="subtle-note">No donations recorded yet.</p>}
            </div>
          </div>

          <div className="settings-form">
            <h2><Ban size={16} /> Appeals ({ownerDash.stats.openAppeals} open).</h2>
            {ownerDash.appeals.length ? ownerDash.appeals.map((ap) => (
              <div className={`owner-appeal ${ap.status === "open" ? "" : "resolved"}`} key={ap.id}>
                <div className="owner-appeal-head">
                  <strong>{ap.mcName}</strong>
                  <span className={`badge ${ap.status === "open" ? "rose" : ap.resolution === "accepted" ? "jade" : "iron"}`}>
                    {ap.status === "open" ? ap.punishment.toUpperCase() : ap.resolution.toUpperCase()}
                  </span>
                  <small>{ap.time}</small>
                </div>
                <p>{ap.reason}</p>
                {ap.status === "open" && (
                  <div className="owner-appeal-actions">
                    <Button variant="outline" onClick={() => { run("resolve_appeal", { id: ap.id, resolution: "accepted" }); setTimeout(loadOwner, 900); }}>
                      <CheckCircle2 size={15} /> Accept
                    </Button>
                    <Button variant="outline" className="btn-rose" onClick={() => { run("resolve_appeal", { id: ap.id, resolution: "denied" }); setTimeout(loadOwner, 900); }}>
                      <XCircle size={15} /> Deny
                    </Button>
                  </div>
                )}
              </div>
            )) : <p className="subtle-note">No appeals submitted yet.</p>}
          </div>

          <div className="settings-form">
            <h2><Crosshair size={16} /> Open bounty board ({ownerDash.stats.openBounties}).</h2>
            {ownerDash.bounties.length ? ownerDash.bounties.map((b) => (
              <div className="dash-feed-row" key={b.id}>
                <Crosshair size={14} />
                <span><strong>{b.target}</strong> · {b.reward} Honor · by {b.poster}</span>
                <small>{b.time}</small>
              </div>
            )) : <p className="subtle-note">The board is clean.</p>}
          </div>
        </>
        )
      )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- donate
export function DonatePage() {
  return (
    <>
      <PageHeading
        eyebrow="KEEP THE LIGHTS ON"
        title="Fund the realm."
        subtitle="No pay-to-win. Donations pay the server bill, donors get a quieter site."
      />
      <div className="store-banner">
        <Coins size={50} />
        <div>
          <h2>Power is earned. Funding is shared.</h2>
          <p>
            Everything gameplay-affecting on this server is free forever. Donations only buy
            comfort: ad-free browsing and a donor badge.
          </p>
        </div>
      </div>
      <div className="achievement-grid">
        {[
          ["Ad-free browsing", "30 days without a single ad after each donation", "jade"],
          ["Donor badge", "A gold mark next to your name on the site", "gold"],
          ["No pay-to-win", "No items, no ranks, no advantages. Ever.", "violet"],
        ].map(([t, d, tone]) => (
          <div className="achievement-card" key={t}>
            <Gem size={35} className={`text-${tone}`} />
            <span className={`badge ${tone}`}>DONOR PERK</span>
            <h2>{t}</h2>
            <p>{d}</p>
          </div>
        ))}
      </div>
      <div className="settings-form">
        <h2>How to donate</h2>
        <p className="subtle-note">
          Automatic payments aren't connected yet. To donate, message the server owner on Discord
          — the donation gets recorded, ads disappear for 30 days, and the transaction is logged
          with a receipt. You'll see your donor status right here on the dashboard.
        </p>
        <p className="subtle-note">
          Non-donors see a small, unobtrusive sponsor note in the sidebar. That's it — no pop-ups,
          no fake buttons, no impersonating site controls.
        </p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- status
export function StatusPage() {
  useSyncExternalStore(subscribeLive, liveVersion, () => 0);
  return (
    <>
      <PageHeading title="Server status" subtitle="A pulse check on the world.">
        <span className="status-pill">
          <span className={`server-dot ${serverStatus.online ? "" : "offline"}`} />
          {serverStatus.configured
            ? serverStatus.online
              ? "All systems operational"
              : "Server offline"
            : "Not configured"}
        </span>
      </PageHeading>
      <Stats
        values={[
          {
            label: "Online players",
            value: serverStatus.online ? `${serverStatus.playersOnline} / ${serverStatus.playersMax || "?"}` : "0",
            icon: Users,
            note: serverStatus.source === "plugin" ? "From the plugin heartbeat" : serverStatus.configured ? "Live ping" : "Waiting for the plugin heartbeat",
          },
          {
            label: "Latency",
            value: serverStatus.ms ? `${serverStatus.ms} ms` : "—",
            icon: Zap,
            note: serverStatus.ms ? "Ping to the server" : "Needs MC_HOST on the site for latency",
          },
          {
            label: "Version",
            value: serverStatus.version || "—",
            icon: Globe,
            note: serverStatus.source === "plugin" ? "Reported by the plugin" : "From the server list ping",
          },
          {
            label: "TPS",
            value: serverStatus.tps != null ? serverStatus.tps.toFixed(1) : "—",
            icon: Gauge,
            note: serverStatus.tps != null ? "Ticks per second (20 is perfect)" : "Shows while the plugin is reporting",
          },
        ]}
      />
      <div className="status-chart">
        <SectionHeading title="Kill activity" />
        <div className="chart-bars">
          {Array.from({ length: 48 }, (_, i) => (
            <div key={i} className={`chart-bar bar-${i % 6}`} />
          ))}
        </div>
        <div className="chart-axis">
          <span>Chart fills as kills are recorded</span>
        </div>
      </div>
      <div className="profile-columns">
        <section>
          <SectionHeading title="Connection details" />
          {[
            ["Java address", serverStatus.host || "Not configured"],
            ["Bedrock", "Via the server's crossplay setup"],
            ["Version", serverStatus.version || "—"],
          ].map(([l, v]) => (
            <div className="detail-line" key={l}>
              <span>{l}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </section>
        <section>
          <SectionHeading title="Recent events" />
          {feed.length ? (
            feed.slice(0, 4).map((f, i) => (
              <div className="combat-event" key={i}>
                <Radio size={20} />
                <div>
                  <strong>{f[0]}</strong>
                  <p>
                    {f[1]} · {f[2]}
                  </p>
                  <small>{f[3]}</small>
                </div>
              </div>
            ))
          ) : (
            <div className="combat-event">
              <Radio size={20} />
              <div>
                <strong>Quiet out there</strong>
                <p>Events appear as the feed records them.</p>
              </div>
            </div>
          )}
        </section>
      </div>
      <p className="subtle-note">
        {serverStatus.source === "plugin"
          ? `Live from the server plugin${serverStatus.heartbeatAge != null ? ` (last beat ${serverStatus.heartbeatAge}s ago)` : ""}.`
          : serverStatus.source === "ping"
            ? "Live from a direct ping of the Minecraft server."
            : isLive()
              ? "No heartbeat from the server plugin in the last 90 seconds, and no ping is configured. Check the plugin's API url + secret."
              : "The API is unreachable right now — numbers will return when it wakes up."}
      </p>
    </>
  );
}

// ===========================================================================
// SERVER PANEL (owners only) — live console, files, power, backups
// ===========================================================================
// Color a console line by log level so problems stand out.
function logTone(line: string) {
  if (/\b(ERROR|SEVERE|FATAL)\b|Exception/.test(line)) return "err";
  if (/\bWARN(ING)?\b/.test(line)) return "warn";
  if (/joined the game|left the game|logged in|lost connection/.test(line)) return "join";
  return "";
}

export function ServerPage() {
  // re-render in place when session data refreshes (no remount, so console,
  // file edits and scroll position survive the 30s refresh)
  useSyncExternalStore(subscribeLive, liveVersion, () => 0);
  const [status, setStatus] = useState<any>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [path, setPath] = useState("");
  const [fileList, setFileList] = useState<any[] | null>(null);
  const [file, setFile] = useState<{ path: string; content: string } | null>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [panelErr, setPanelErr] = useState("");
  const [busy, setBusy] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const polling = useRef(false);

  // quiet = background poll: no busy flicker, errors go to the banner only
  const call = async (op: string, extra: Record<string, any> = {}, quiet = false) => {
    if (!quiet) setBusy(true);
    try {
      const r = await doAction(op, extra);
      if (!r.ok) {
        if (quiet) setPanelErr(r.msg || "Panel request failed.");
        else setMsg(r.msg || "Panel request failed.");
      } else if (quiet) {
        setPanelErr("");
      }
      return r;
    } finally {
      if (!quiet) setBusy(false);
    }
  };

  const refreshStatus = async (quiet = false) => {
    const r = await call("panel_status", {}, quiet);
    if (r.ok) setStatus(r);
  };
  const refreshLog = async (quiet = false) => {
    const r = await call("panel_log", { lines: 80 }, quiet);
    if (r.ok && Array.isArray(r.lines)) setLogLines(r.lines);
  };
  const refreshBackups = async (quiet = false) => {
    const r = await call("panel_backups", {}, quiet);
    if (r.ok) setBackups(r.backups || []);
  };
  const runCommand = async () => {
    const cmd = command.trim();
    if (!cmd) return;
    setCommand("");
    const r = await call("panel_exec", { command: cmd });
    if (r.ok) { setMsg(`Sent: ${cmd}`); if (Array.isArray(r.lines)) setLogLines(r.lines); }
  };
  const openDir = async (p: string) => {
    const r = await call("panel_files", { path: p });
    if (r.ok) { setFileList(r.items || []); setPath(r.path || p); }
  };
  const openFile = async (p: string) => {
    const r = await call("panel_read", { path: p });
    if (r.ok) setFile({ path: r.path || p, content: r.content ?? "" });
  };
  const saveFile = async () => {
    if (!file) return;
    const r = await call("panel_write", { path: file.path, content: file.content });
    setMsg(r.ok ? `Saved ${file.path}` : r.msg || "Save failed.");
  };
  const power = async (action: string) => {
    if ((action === "stop" || action === "restart") &&
        !window.confirm(`${action === "stop" ? "Stop" : "Restart"} the Minecraft server? Everyone online will be disconnected.`)) return;
    const r = await call("panel_power", { action });
    setMsg(r.ok ? `Power: ${action} sent.` : r.msg || "Power action failed.");
    refreshStatus(true);
  };
  const backup = async () => {
    const r = await call("panel_backup");
    setMsg(r.ok ? `Backup created: ${r.file} (${r.size_kb} KB)` : r.msg || "Backup failed.");
    refreshBackups(true);
  };

  // load once the owner session is known, then poll quietly
  useEffect(() => {
    if (!me.admin) return;
    refreshStatus(true);
    refreshLog(true);
    refreshBackups(true);
    openDir(".");
    const t = setInterval(async () => {
      if (polling.current) return; // never stack requests on a slow agent
      polling.current = true;
      try { await Promise.all([refreshStatus(true), refreshLog(true)]); } finally { polling.current = false; }
    }, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.admin]);

  // keep the console pinned to the newest line unless the owner scrolled up
  useEffect(() => {
    const el = consoleRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [logLines]);

  if (!me.admin)
    return (
      <>
        <PageHeading title="Server panel" subtitle="Owners only." />
        <div className="private-state" style={{ maxWidth: 420 }}>
          <Lock size={28} />
          <h3>This area is for server owners</h3>
          <p>Log in with an owner Discord account to reach the console and file manager.</p>
        </div>
      </>
    );

  const running = !!status?.running;
  const dir = !path || path === "." ? "" : path;
  const parent = dir.includes("/") ? dir.split("/").slice(0, -1).join("/") : ".";
  const memPct = status && status.mem_total_mb ? Math.min(100, Math.round((status.mem_used_mb / status.mem_total_mb) * 100)) : 0;

  return (
    <>
      <PageHeading eyebrow="OWNERS ONLY" title="Server panel." subtitle="Console, files, power and backups — straight from the VPS.">
        <span className="status-pill">
          <span className={`server-dot ${running ? "" : "offline"}`} />
          {status ? (running ? "Running" : "Stopped") : "Checking…"}
        </span>
      </PageHeading>

      {panelErr && (
        <div className="dash-msg err" role="alert">
          Can't reach the panel agent: {panelErr}. Check PANEL_AGENT_URL / PANEL_AGENT_SECRET on the API and that the agent is running on the VPS.
        </div>
      )}
      {msg && <div className="dash-msg" role="status">{msg}</div>}

      <Stats
        values={[
          { label: "Server", value: status ? (running ? "Running" : "Stopped") : "—", icon: Activity, note: serverStatus.online ? `${serverStatus.playersOnline}/${serverStatus.playersMax || "?"} players online` : `screen: ${status?.screen ?? "—"}` },
          { label: "CPU load", value: status ? `${status.cpu_pct}` : "—", icon: Gauge, note: "1-min load average" },
          { label: "Memory", value: status ? `${status.mem_used_mb} / ${status.mem_total_mb} MB` : "—", icon: MemoryStick, note: status ? `${memPct}% of the VPS in use` : "VPS total" },
          { label: "Uptime", value: status ? `${Math.floor((status.uptime_s || 0) / 3600)}h` : "—", icon: Clock, note: "VPS uptime" },
        ]}
      />

      <div className="srv-layout">
        <section className="panel-card srv-console">
          <div className="panel-head">
            <h3><Terminal size={15} /> Console</h3>
            <span className="panel-tag">live · 5s</span>
          </div>
          <div
            className="console-out"
            ref={consoleRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
            }}
          >
            {logLines.length
              ? logLines.map((l, i) => <div key={i} className={`log-line ${logTone(l)}`}>{l}</div>)
              : <div className="muted">No log output yet.</div>}
          </div>
          <div className="console-input">
            <span className="console-prompt">&gt;</span>
            <input
              placeholder="say Hello from the panel"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runCommand()}
              aria-label="Console command"
            />
            <Button disabled={busy || !command.trim()} onClick={runCommand}><Send size={14} /> Run</Button>
          </div>
          <p className="muted">Runs as a real console command on the server (no slash needed).</p>
        </section>

        <div className="srv-side">
          <section className="panel-card">
            <div className="panel-head"><h3><Zap size={15} /> Power</h3></div>
            <div className="power-grid">
              <Button variant="outline" className="power-btn start" disabled={busy || running} onClick={() => power("start")}><Play size={15} /> Start</Button>
              <Button variant="outline" className="power-btn" disabled={busy} onClick={() => power("restart")}><RotateCw size={15} /> Restart</Button>
              <Button variant="outline" className="power-btn stop" disabled={busy || (!!status && !running)} onClick={() => power("stop")}><Square size={15} /> Stop</Button>
            </div>
            <Button disabled={busy} onClick={backup}><Archive size={15} /> Backup world</Button>
          </section>

          <section className="panel-card">
            <div className="panel-head">
              <h3><HardDrive size={15} /> Backups</h3>
              <button className="link-cancel" onClick={() => refreshBackups()} disabled={busy}>refresh</button>
            </div>
            {backups.length ? (
              <div className="file-list">
                {backups.map((b: any) => (
                  <div key={b.name} className="file-row static"><Archive size={14} /> <span className="file-name">{b.name}</span> <span className="muted">{b.size_kb} KB</span></div>
                ))}
              </div>
            ) : (
              <p className="muted">No backups yet — make the first one.</p>
            )}
          </section>
        </div>

        <section className="panel-card srv-files">
          <div className="panel-head"><h3><Folder size={15} /> Files</h3></div>
          <div className="console-input">
            <span className="console-prompt">/</span>
            <input
              placeholder="path (e.g. . or server.properties)"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && openDir(path || ".")}
              aria-label="Path"
            />
            <Button variant="outline" disabled={busy} onClick={() => openDir(path || ".")}>Browse</Button>
          </div>
          {fileList && (
            <div className="file-list">
              {dir && (
                <button className="file-row" onClick={() => openDir(parent)}>
                  <Folder size={14} /> <span className="file-name">..</span>
                </button>
              )}
              {fileList.map((f: any) => (
                <button
                  key={f.name}
                  className="file-row"
                  onClick={() => (f.dir ? openDir(`${dir ? dir + "/" : ""}${f.name}`) : openFile(`${dir ? dir + "/" : ""}${f.name}`))}
                >
                  {f.dir ? <Folder size={14} /> : <FileText size={14} />}
                  <span className="file-name">{f.name}</span>
                  {f.dir ? null : <span className="muted">{f.size_kb} KB</span>}
                </button>
              ))}
            </div>
          )}
          {file && (
            <div className="file-editor">
              <strong>{file.path}</strong>
              <textarea
                value={file.content}
                onChange={(e) => setFile({ ...file, content: e.target.value })}
                rows={12}
                spellCheck={false}
              />
              <div className="power-row">
                <Button disabled={busy} onClick={saveFile}><Check size={14} /> Save</Button>
                <Button variant="outline" onClick={() => setFile(null)}>Close</Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
