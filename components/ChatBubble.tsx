"use client";
// Floating assistant bubble on every page. Stub mode until the LLM brain is on.
import { useEffect, useRef, useState } from "react";

type Msg = { from: "you" | "bot"; text: string };

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setMsgs(m => [...m, { from: "you", text: t }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: t }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Something glitched. Try again!";
      setMsgs(m => [...m, { from: "bot", text: reply }]);
    } catch {
      setMsgs(m => [...m, { from: "bot", text: "I can't reach my brain right now — try again in a minute!" }]);
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          if (msgs.length === 0) send("hello");
        }}
        className="fixed bottom-4 right-4 z-50 pixel text-[10px] text-[#7cfc00] bg-[#1d2d24] border-4 border-[#0a3d0d] px-4 py-3 hover:bg-[#2b4436] shadow-[4px_4px_0_#0a3d0d]"
        aria-label="Open assistant chat"
      >
        ⚙ CHAT
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] max-w-[90vw] mc-panel flex flex-col" style={{ height: "420px", maxHeight: "70vh" }}>
      <div className="flex items-center justify-between border-b-4 border-[#1d2d24] pb-2 mb-2">
        <span className="pixel text-[10px] text-[#7cfc00]">⚙ SHATTY</span>
        <button onClick={() => setOpen(false)} className="text-[#5c8a66] hover:text-[#7cfc00] text-lg leading-none px-1" aria-label="Close chat">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-base">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "you" ? "text-right" : ""}>
            <span className={"inline-block px-2 py-1 border-2 " + (m.from === "you"
              ? "border-[#2b4436] text-[#9fd6a4]"
              : "border-[#0a3d0d] bg-[#16211b] text-[#c8e6c9]")}
              style={{ whiteSpace: "pre-wrap" }}>
              {m.text}
            </span>
          </div>
        ))}
        {busy && <div className="text-[#5c8a66] text-sm">Shatty is thinking…</div>}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex gap-2 border-t-4 border-[#1d2d24] pt-2 mt-2"
        onSubmit={e => { e.preventDefault(); send(input); }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the server…"
          className="flex-1 bg-[#16211b] border-2 border-[#2b4436] text-[#c8e6c9] px-2 py-1 text-base outline-none focus:border-[#7cfc00]"
          maxLength={500}
        />
        <button type="submit" disabled={busy} className="pixel text-[8px] text-[#7cfc00] px-3 py-2 bg-[#1d2d24] border-2 border-[#0a3d0d] hover:bg-[#2b4436] disabled:opacity-50">
          SEND
        </button>
      </form>
    </div>
  );
}
