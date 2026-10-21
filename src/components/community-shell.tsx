import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Shield,
  MessagesSquare,
  Activity,
  ArrowUpRight,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Crosshair,
  LogIn,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShardBubble } from "@/components/shard-bubble";
import {
  players, me, fetchLive, fetchMe, isLive, isDonor, serverStatus, type Player,
} from "@/lib/community-data";

const navigation = [
  { to: "/", label: "Shattered", icon: LayoutDashboard },
  { to: "/server", label: "Server", icon: TerminalSquare, adminOnly: true },
  { to: "/players", label: "Players", icon: Users },
  { to: "/bounties", label: "Bounty board", icon: Crosshair },
  { to: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { to: "/factions", label: "Factions", icon: Shield },
  { to: "/community", label: "Community", icon: MessagesSquare },
  { to: "/status", label: "Server status", icon: Activity },
  { to: "/dashboard", label: "My dashboard", icon: SlidersHorizontal },
] as const;

export function Avatar({ player, large = false }: { player: Player; large?: boolean }) {
  return (
    <span
      className={`pixel-avatar ${player.tone} ${large ? "large" : ""} ${player.avatar ? "has-img" : ""}`}
      aria-label={`${player.name} avatar`}
    >
      {player.avatar ? (
        <img src={player.avatar} alt="" loading="lazy" />
      ) : (
        <>
          <span className="pixel-eyes" />
          <span className="pixel-mouth" />
        </>
      )}
      {player.online && <i className="online-dot" />}
    </span>
  );
}

// The Discord "Clyde" logo (from the owner's uploaded SVG), recolorable
// via the text color of its parent.
export function DiscordMark({ size = 17 }: { size?: number }) {
  return (
    <svg className="discord-mark" viewBox="0 -28.5 256 256" width={size} height={size}
         fill="currentColor" aria-hidden="true">
      <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
    </svg>
  );
}

function AdSlot() {
  // Subtle house ads. Donors (within 30 days of donating) never see them.
  if (isDonor() || !isLive()) return null;
  return (
    <div className="ad-slot">
      <small>SPONSORED</small>
      <p>Like the site? Donations keep the server alive.</p>
      <Link to="/donate">
        Support the realm <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}

export function CommunityShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [liveTick, setLiveTick] = useState(0);

  // hydrate live data before first paint, then poll every 30s for the live feed
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      await fetchLive();
      await fetchMe();
      if (alive) setLiveTick((t) => t + 1);
    };
    refresh();
    const iv = setInterval(refresh, 30000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  // close the drawer on any route change
  useEffect(() => setMenu(false), [path]);
  // ESC closes the drawer; lock body scroll while it is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menu]);

  useEffect(() => {
    setNotifCount(me.notifications.length);
  }, [path]);

  return (
    <div className="app-shell">
      {menu && <div className="menu-backdrop" onClick={() => setMenu(false)} aria-hidden="true" />}
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <Link to="/" className="brand" onClick={() => setMenu(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="shard-logo" role="img" aria-hidden="true">
              <path d="M14 1 5.5 10l4 2.5L8 23l10.5-11-3.7-2.6L14 1z" fill="#fff"/>
            </svg>
          </span>
          <span>
            SHATTERED<span className="brand-sub">SEMI-ANARCHY · NO HACKS</span>
          </span>
        </Link>
        <div className="server-switch">
          <span className={`server-dot ${serverStatus.online ? "" : "offline"}`} />
          <div>
            Shattered SMP
            <small>
              {serverStatus.configured
                ? serverStatus.online
                  ? `${serverStatus.playersOnline} online · ${serverStatus.version}`
                  : "Server offline"
                : "Not configured"}
            </small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">EXPLORE</div>
        <nav>
          {navigation.filter((n) => !(n as any).adminOnly || me.admin).map((n) => (
            <Button
              key={n.to}
              variant="ghost"
              asChild
              className={`nav-item ${path === n.to || (n.to !== "/" && path.startsWith(n.to)) ? "active" : ""}`}
            >
              <Link to={n.to} onClick={() => setMenu(false)}>
                <n.icon size={18} />
                <span>{n.label}</span>
                {n.to === "/bounties" && <span className="nav-count">⚔</span>}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <AdSlot />
          <div className="support-mini">
            <Sparkles size={18} />
            <strong>One rule: no hacks. Real stats.</strong>
            <p>Every number here comes from the live server feed.</p>
          </div>
          {me.logged ? (
            <Link to="/dashboard" className="sidebar-user" onClick={() => setMenu(false)}>
              {me.mcName ? (
                <Avatar player={players.find((p) => p.name === me.mcName) ?? players[0]} />
              ) : (
                <span className="pixel-avatar iron">
                  <span className="pixel-eyes" />
                  <span className="pixel-mouth" />
                </span>
              )}
              <div>
                <strong>{me.mcName || me.username}</strong>
                <small>{me.admin ? "Owner" : isDonor() ? "Donor" : "Member"}</small>
              </div>
              <ChevronDown size={14} />
            </Link>
          ) : (
            <Button asChild className="sidebar-login login-tile">
              <a href="/auth/discord">
                <DiscordMark size={17} />
                Sign in with Discord
              </a>
            </Button>
          )}
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="top-left">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
            <span className="breadcrumb">
              Anarchy <span>/</span>{" "}
              <strong>{navigation.find((n) => n.to === path)?.label ?? "Shattered"}</strong>
            </span>
          </div>
          <div className="top-actions">
            <span className={`live-tag ${isLive() ? "on" : ""}`}>
              {isLive() ? "LIVE DATA" : "OFFLINE"}
            </span>
            <Button variant="ghost" size="icon" aria-label="Search players" asChild>
              <Link to="/players">
                <Search />
              </Link>
            </Button>
            {me.logged && (
              <div className="notification-wrap">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  onClick={() => setNotifications(!notifications)}
                >
                  <Bell />
                  {notifCount > 0 && <i className="notification-dot" />}
                </Button>
                {notifications && (
                  <div className="notification-panel">
                    <strong>Notifications</strong>
                    {me.notifications.length ? (
                      me.notifications.map((n) => (
                        <p key={n.id}>
                          {n.kind === "bounty" ? "⚔ " : n.kind === "revenge" ? "🩸 " : "• "}
                          {n.body}
                          <small>{n.time}</small>
                        </p>
                      ))
                    ) : (
                      <p>Nothing yet. Kills, bounties and revenge land here.</p>
                    )}
                  </div>
                )}
              </div>
            )}
            <Link to="/dashboard">
              {me.logged ? (
                <span className="pixel-avatar iron top-avatar">
                  <span className="pixel-eyes" />
                  <span className="pixel-mouth" />
                </span>
              ) : (
                <Button size="sm" asChild className="btn-discord">
                  <a href="/auth/discord"><DiscordMark size={15} /> Sign in</a>
                </Button>
              )}
            </Link>
          </div>
        </header>
        {/* Most pages remount on each data refresh. The dashboard and server
            panel hold tabs, drafts and file edits, so they keep a stable key
            and re-render in place via subscribeLive instead. */}
        <main key={path.startsWith("/dashboard") || path.startsWith("/server") ? "stateful" : liveTick}>
          {children}
        </main>
        <footer>
          <span>© 2026 Shattered SMP</span>
          <span>
            Not an official Minecraft service.{" "}
            <Link to="/donate" className="footer-link">
              Support the server
            </Link>
          </span>
          <Link to="/status">
            <span className={`server-dot ${serverStatus.online ? "" : "offline"}`} />{" "}
            {serverStatus.online ? "Server online" : "Server offline"}
          </Link>
        </footer>
      </div>
          <ShardBubble />
</div>
  );
}
