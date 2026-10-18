import Link from "next/link";
import { searchPlayers, timeAgo, avatarUrl } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function Players({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const data = await searchPlayers(q);

  return (
    <div className="space-y-6">
      <h1 className="pixel text-lg text-[#7cfc00]" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>PLAYERS</h1>
      <form action="/players" method="get" className="flex gap-3">
        <input
          className="mc-input flex-1"
          type="text"
          name="q"
          placeholder="Search player name..."
          defaultValue={q}
        />
        <button className="mc-btn px-6" type="submit">Search</button>
      </form>
      <div className="mc-panel p-6">
        {data.players.length === 0 ? (
          <p className="text-[#5c8a66]">{q ? `No players matching "${q}".` : "No players yet."}</p>
        ) : (
          <table className="mc-table">
            <thead>
              <tr><th>PLAYER</th><th>KILLS</th><th>DEATHS</th><th>PLAYTIME</th><th>LAST SEEN</th></tr>
            </thead>
            <tbody>
              {data.players.map((p, i) => (
                <tr key={i}>
                  <td>
                    <span className="inline-flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl(p)} alt="" width={32} height={32} style={{ imageRendering: "pixelated" }} />
                      <Link className="mc-link" href={`/players/${encodeURIComponent(p.username)}`}>{p.username}</Link>
                      <span className={`edition-pill edition-${p.edition}`}>{p.edition}</span>
                    </span>
                  </td>
                  <td><span className="sword">⚔</span> {p.kills}</td>
                  <td><span className="skull">☠</span> {p.deaths}</td>
                  <td>{p.playtime_human}</td>
                  <td className="text-[#9fd6a4]">{timeAgo(p.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
