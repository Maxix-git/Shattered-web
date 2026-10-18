import { getKillfeed, timeAgo } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function Killfeed() {
  const feed = await getKillfeed(50);

  return (
    <div className="space-y-6">
      <h1 className="pixel text-lg text-[#7cfc00]" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>KILL FEED</h1>
      <div className="mc-panel p-6">
        {feed.kills.length === 0 ? (
          <p className="text-[#5c8a66]">No blood spilled yet.</p>
        ) : (
          <table className="mc-table">
            <thead><tr><th>KILLER</th><th>VICTIM</th><th>CAUSE</th><th>DIMENSION</th><th>WHEN</th></tr></thead>
            <tbody>
              {feed.kills.map((k, i) => (
                <tr key={i}>
                  <td><span className="sword">{k.killer ?? "The World"}</span></td>
                  <td><span className="skull">{k.victim}</span></td>
                  <td>{k.cause}</td>
                  <td className="text-[#9fd6a4]">{k.dimension}</td>
                  <td className="text-[#5c8a66]">{timeAgo(k.occurred_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
