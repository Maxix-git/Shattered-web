import Link from "next/link";
import { getLeaderboard } from "../../lib/api";

export const dynamic = "force-dynamic";

const METRICS = [
  { id: "kills", label: "Kills" },
  { id: "deaths", label: "Deaths" },
  { id: "kill_streak", label: "Current Streak" },
  { id: "longest_streak", label: "Best Streak" },
  { id: "playtime", label: "Playtime" },
];

export default async function Leaderboards({ searchParams }: { searchParams: Promise<{ metric?: string }> }) {
  const { metric = "kills" } = await searchParams;
  const active = METRICS.find(m => m.id === metric) ?? METRICS[0];
  const board = await getLeaderboard(active.id);

  return (
    <div className="space-y-6">
      <h1 className="pixel text-lg text-[#7cfc00]" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>LEADERBOARDS</h1>
      <div className="flex flex-wrap gap-3">
        {METRICS.map(m => (
          <Link
            key={m.id}
            href={`/leaderboards?metric=${m.id}`}
            className={m.id === active.id ? "mc-btn px-4 py-2" : "mc-panel px-4 py-2 text-[#9fd6a4]"}
          >
            {m.label}
          </Link>
        ))}
      </div>
      <div className="mc-panel p-6">
        {board.entries.length === 0 ? (
          <p className="text-[#5c8a66]">No entries yet. Go make history.</p>
        ) : (
          <table className="mc-table">
            <thead>
              <tr><th>RANK</th><th>PLAYER</th><th>EDITION</th><th className="text-right">{active.label.toUpperCase()}</th></tr>
            </thead>
            <tbody>
              {board.entries.map(e => (
                <tr key={`${e.rank}-${e.username}`}>
                  <td className={`pixel text-xs rank-${e.rank}`}>#{e.rank}</td>
                  <td>
                    <Link className="mc-link" href={`/players/${encodeURIComponent(e.username)}`}>{e.username}</Link>
                  </td>
                  <td><span className={`edition-pill edition-${e.edition}`}>{e.edition}</span></td>
                  <td className="text-right text-[#7cfc00]">{e.value_human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
