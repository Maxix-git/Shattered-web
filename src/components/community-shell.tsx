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
                <small>{isDonor() ? "Donor" : "Member"}</small>
              </div>
              <ChevronDown size={14} />
            </Link>
          ) : (
            <Button asChild className="sidebar-login login-tile">
              <a href="/auth/discord">
                <svg className="discord-mark" viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                </svg>
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
