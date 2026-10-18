import { getPlayer, timeAgo, avatarUrl } from "../../../lib/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlayerPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const p = await getPlayer(username);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div className="mc-panel p-6 flex items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl(p)}
          alt={p.username}
          width={96} height={96}
          className="border-4 border-[#2b4436]"
          style={{ imageRendering: "pixelated" }}
        />
        <div>
          <h1 className="pixel text-xl text-[#7cfc00]" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>{p.username}</h1>
          <p className="mt-2 flex items-center gap-3">
            <span className={`edition-pill edition-${p.edition}`}>{p.edition}</span>
            <span className="text-[#9fd6a4]">last seen {timeAgo(p.last_seen)}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "KILLS", value: p.stats.kills, color: "#7cfc00" },
          { label: "DEATHS", value: p.stats.deaths, color: "#ff6b6b" },
          { label: "BEST STREAK", value: p.stats.longest_streak, color: "#f7c948" },
          { label: "PLAYTIME", value: p.stats.playtime_human, color: "#58c7f3" },
        ].map(s => (
          <div key={s.label} className="mc-panel p-4 text-center">
            <div className="pixel text-xs text-[#9fd6a4] mb-2">{s.label}</div>
            <div className="text-3xl" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mc-panel p-6">
        <h2 className="pixel text-xs text-[#9fd6a4] mb-4">COMBAT HISTORY</h2>
        <p className="text-base text-[#5c8a66] mb-4">
          K/D ratio: <span className="text-[#7cfc00]">{p.stats.kd_ratio}</span> · Current streak: {p.stats.kill_streak} · First joined {timeAgo(p.first_join)}
        </p>
        {p.recent_combat.length === 0 ? (
          <p className="text-[#5c8a66]">No combat on record.</p>
        ) : (
          <ul className="space-y-2 text-lg">
            {p.recent_combat.map((k, i) => (
              <li key={i} className="border-b-2 border-[#1d2d24] pb-2">
                {k.killer === p.username ? (
                  <span><span className="sword">{k.killer}</span> slew <span className="skull">{k.victim}</span></span>
                ) : (
                  <span><span className="skull">{p.username}</span> was slain by <span className="sword">{k.killer ?? k.cause}</span></span>
                )}
                <span className="text-[#5c8a66]"> · {k.cause} · {k.dimension} · {timeAgo(k.occurred_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
