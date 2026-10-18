"use client";
// /link page logic: Discord login state + code entry.
import { useEffect, useState } from "react";

export default function LinkBox() {
  const [me, setMe] = useState<{ discord_id: string | null; discord_username?: string } | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(setMe).catch(() => setMe({ discord_id: null }));
  }, []);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setResult(null);
    try {
      const res = await fetch("/api/link/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.linked) setResult(`✓ Linked to ${data.username}! Your Discord and Minecraft accounts are now connected.`);
      else setResult(`✗ ${data.error ?? "something went wrong"}`);
    } catch {
      setResult("✗ can't reach the website backend");
    }
    setBusy(false);
  }

  if (me === null) return <p className="text-[#5c8a66]">Loading…</p>;

  return (
    <div className="mc-panel p-6 max-w-md mx-auto">
      <ol className="space-y-2 text-lg mb-6">
        <li><span className="text-[#7cfc00]">1.</span> Join the server and run <code className="text-[#7cfc00]">/link</code></li>
        <li><span className="text-[#7cfc00]">2.</span> Log in with Discord below</li>
        <li><span className="text-[#7cfc00]">3.</span> Enter your 6-character code</li>
      </ol>

      {me.discord_id === null ? (
        <a href="/api/auth/discord/start" className="block text-center pixel text-[10px] text-[#7cfc00] bg-[#1d2d24] border-4 border-[#0a3d0d] px-4 py-3 hover:bg-[#2b4436] shadow-[4px_4px_0_#0a3d0d]">
          LOGIN WITH DISCORD
        </a>
      ) : (
        <div>
          <p className="text-[#9fd6a4] mb-4">Logged in as <span className="text-[#7cfc00]">{me.discord_username || me.discord_id}</span></p>
          <form onSubmit={claim} className="flex gap-2">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABC123"
              className="flex-1 bg-[#16211b] border-2 border-[#2b4436] text-[#c8e6c9] px-2 py-1 text-lg tracking-widest outline-none focus:border-[#7cfc00]"
              maxLength={6}
            />
            <button type="submit" disabled={busy || code.length !== 6} className="pixel text-[8px] text-[#7cfc00] px-4 py-2 bg-[#1d2d24] border-2 border-[#0a3d0d] hover:bg-[#2b4436] disabled:opacity-50">
              LINK
            </button>
          </form>
        </div>
      )}

      {result && <p className={"mt-4 text-base " + (result.startsWith("✓") ? "text-[#7cfc00]" : "text-[#ff6b6b]")}>{result}</p>}
    </div>
  );
}
