// Shard — the floating server assistant. Chats through /api/assistant, which
// proxies the Shattered API. Smooth, quiet, jade-accented like the rest of the UI.
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

type Msg = { from: "shard" | "you"; text: string };

const GREETING: Msg = {
  from: "shard",
  text: "Hey — I'm Shard, the realm assistant. Ask me who's online, the top killers, the server status, or where to start.",
};

export function ShardBubble() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setMsgs((m) => [...m, { from: "you", text }]);
    setBusy(true);
    let reply = "Backend unreachable. Try again in a moment.";
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const j = await r.json().catch(() => null);
      if (j?.ok && j.reply) reply = j.reply;
    } catch {}
    setMsgs((m) => [...m, { from: "shard", text: reply }]);
    setBusy(false);
  }

  return (
    <>
      {open ? (
        <div className="shard-panel">
          <div className="shard-head">
            <Sparkles size={15} />
            <div>
              <strong>Shard</strong>
              <small>Server assistant</small>
            </div>
            <button className="shard-close" onClick={() => setOpen(false)} aria-label="Close Shard">
              <X size={16} />
            </button>
          </div>
          <div className="shard-msgs" ref={listRef}>
            {msgs.map((m, i) => (
              <div className={`shard-msg ${m.from}`} key={i}>
                {m.text}
              </div>
            ))}
            {busy && <div className="shard-msg shard typing">Shard is thinking…</div>}
          </div>
          <div className="shard-input">
            <input
              value={draft}
              placeholder="Ask about players, kills, status…"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              maxLength={500}
            />
            <button onClick={send} disabled={busy || !draft.trim()} aria-label="Send">
              <Send size={15} />
            </button>
          </div>
        </div>
      ) : (
        <button className="shard-fab" onClick={() => setOpen(true)} aria-label="Open Shard assistant">
          <Sparkles size={19} />
        </button>
      )}
    </>
  );
}
