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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShardBubble } from "@/components/shard-bubble";
import {
  players, me, fetchLive, fetchMe, isLive, isDonor, serverStatus, type Player,
} from "@/lib/community-data";

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
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
      className={`pixel-avatar ${player.tone} ${large ? "large" : ""}`}
      aria-label={`${player.name} avatar`}
    >
      <span className="pixel-eyes" />
      <span className="pixel-mouth" />
      {player.online && <i className="online-dot" />}
    </span>
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
          <span className="brand-mark">S</span>
          <span>
            SHATTERED<span className="brand-sub">ANARCHY · NO RULES</span>
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
          {navigation.map((n) => (
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
            <strong>No rules. Real stats.</strong>
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
                <small>{isDonor() ? "Donor" : "Member"}</small>
              </div>
              <ChevronDown size={14} />
            </Link>
          ) : (
            <Button asChild className="sidebar-login">
              <a href="/auth/discord">
                <LogIn size={15} /> Sign in with Discord
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
                <Button size="sm" asChild>
                  <a href="/auth/discord">Sign in</a>
                </Button>
              )}
            </Link>
          </div>
        </header>
        <main key={liveTick}>{children}</main>
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
