// Shard — the floating server assistant. Chats through /api/assistant, which
// proxies the Shattered API. Wakes the API on open, retries once on timeout
// (Render free instances sleep), and shows its mode honestly.
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
  const [mode, setMode] = useState<string>("");
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  // Wake the API the moment the bubble opens so the first question isn't
  // eaten by a cold Render instance (timeout + retry below covers the rest).
  useEffect(() => {
    if (!open) return;
    fetch("/api/assistant", { headers: { accept: "application/json" } })
      .then((r) => r.json())
      .then((j) => { if (j?.mode) setMode(j.mode); })
      .catch(() => {});
  }, [open]);

  async function ask(text: string): Promise<string> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch("/api/assistant", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: AbortSignal.timeout(25_000),
        });
        const j = await r.json().catch(() => null);
        if (j?.ok && j.reply) return j.reply;
        if (r.status === 503) return "I'm not connected to the server data yet. The owner needs to set SITE_API_URL on the site.";
      } catch {
        /* network error or timeout — retry once */
      }
    }
    return "I still can't reach the server. It may be waking up — give it a few seconds and try again.";
  }

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setMsgs((m) => [...m, { from: "you", text }]);
    setBusy(true);
    const reply = await ask(text);
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
              <small>{mode === "llm" ? "AI assistant" : mode === "stub" ? "Basic mode" : "Server assistant"}</small>
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
            {busy && <div className="shard-msg shard">…</div>}
          </div>
          <div className="shard-input">
            <input
              value={draft}
              placeholder="Ask Shard anything…"
              maxLength={500}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
            />
            <button onClick={send} disabled={busy || !draft.trim()} aria-label="Send">
              <Send size={15} />
            </button>
          </div>
        </div>
      ) : (
        <button className="shard-fab" onClick={() => setOpen(true)} aria-label="Open Shard assistant">
          <Sparkles size={20} />
          <span>Ask Shard</span>
        </button>
      )}
    </>
  );
}
