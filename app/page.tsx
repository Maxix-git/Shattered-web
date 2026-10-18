import Link from "next/link";
import { getStatus, getLeaderboard, getKillfeed, timeAgo } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [status, topKills, feed] = await Promise.all([
    getStatus(),
    getLeaderboard("kills"),
    getKillfeed(8),
  ]);
  const site = status.site ?? "Shattered SMP";

  return (
    <div className="space-y-8">
      <section className="mc-panel p-8 text-center">
        <h1 className="pixel text-2xl sm:text-3xl text-[#7cfc00] mb-3" style={{ textShadow: "3px 3px 0 #0a3d0d" }}>
          {site}
        </h1>
        <p className="text-xl text-[#9fd6a4] mb-6">Semi-anarchy crossplay survival. Java + Bedrock.</p>
        <div className="flex flex-wrap justify-center gap-4 text-lg">
          <span className="mc-btn px-6 py-2 cursor-default">{status.tracked_players} players tracked</span>
          <Link href="/leaderboards" className="mc-btn px-6 py-2 inline-block">View Leaderboards</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="mc-panel p-6">
          <h2 className="pixel text-xs text-[#9fd6a4] mb-4">SERVER STATUS</h2>
          <ul className="space-y-2 text-lg">
            <li>Players tracked: <span className="text-[#7cfc00]">{status.tracked_players}</span></li>
            <li>Version: <span className="text-[#7cfc00]">{status.minecraft_version ?? "TBA at launch"}</span></li>
            <li>Java: <span className="text-[#7cfc00]">{status.java_address ?? "TBA at launch"}</span></li>
            <li>Bedrock: <span className="text-[#7cfc00]">{status.bedrock_address ?? "TBA at launch"}</span></li>
            {status.live ? (
              <li>Online now: <span className="text-[#7cfc00]">{status.live.online_players}/{status.live.max_players}</span>
                <span className="ml-2 pixel text-[8px] text-[#7cfc00] animate-pulse">&#9650; LIVE</span></li>
            ) : null}
            {status.live ? (
              <li>TPS: <span className="text-[#7cfc00]">{status.live.tps}</span></li>
            ) : null}
            {status.live && status.live.motd ? (
              <li className="text-base text-[#5c8a66]">MOTD: {status.live.motd}</li>
            ) : null}
            <li className="text-base text-[#5c8a66]">
              Data freshness: <span className={status.data_freshness === "live" ? "text-[#7cfc00]" : "text-[#5c8a66]"}>
                {status.data_freshness}
              </span>
              {status.data_freshness !== "live" ? " (server offline — showing records)" : ""}
            </li>
          </ul>
        </div>
        <div className="mc-panel p-6">
          <h2 className="pixel text-xs text-[#9fd6a4] mb-4">TOP KILLERS</h2>
          {topKills.entries.length === 0 ? (
            <p className="text-[#5c8a66]">No kills recorded yet. Be the first.</p>
          ) : (
            <table className="mc-table">
              <tbody>
                {topKills.entries.slice(0, 5).map(e => (
                  <tr key={e.rank}>
                    <td className={`pixel text-xs rank-${e.rank}`}>#{e.rank}</td>
                    <td>
                      <Link className="mc-link" href={`/players/${encodeURIComponent(e.username)}`}>{e.username}</Link>
                    </td>
                    <td className="text-right"><span className="sword">⚔</span> {e.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mc-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixel text-xs text-[#9fd6a4]">LATEST KILLS</h2>
          <Link className="mc-link text-base" href="/killfeed">Full feed →</Link>
        </div>
        {feed.kills.length === 0 ? (
          <p className="text-[#5c8a66]">Quiet so far... too quiet.</p>
        ) : (
          <ul className="space-y-2 text-lg">
            {feed.kills.map((k, i) => (
              <li key={i} className="border-b-2 border-[#1d2d24] pb-2">
                <span className="sword">{k.killer ?? "The World"}</span>
                <span className="text-[#5c8a66]"> {k.cause === "SELFTEST" ? "slayed" : "slew"} </span>
                <span className="skull">{k.victim}</span>
                <span className="text-[#5c8a66]"> · {timeAgo(k.occurred_at)} · {k.dimension}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
