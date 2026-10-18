import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ChatBubble from "../components/ChatBubble";

const SITE = process.env.NEXT_PUBLIC_SITE_NAME ?? "Shattered SMP";

export const metadata: Metadata = {
  title: `${SITE} — Minecraft Server`,
  description: `Official site of ${SITE}: stats, leaderboards, kill feed and community.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <header className="border-b-4 border-[#2b4436] bg-[#16211b]/90 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/" className="pixel text-sm text-[#7cfc00]" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>
              {SITE}
            </Link>
            <nav className="flex gap-5 text-lg">
              <Link className="mc-link" href="/">Home</Link>
              <Link className="mc-link" href="/leaderboards">Leaderboards</Link>
              <Link className="mc-link" href="/players">Players</Link>
              <Link className="mc-link" href="/killfeed">Kill Feed</Link>
              <Link className="mc-link" href="/link">Link Account</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t-4 border-[#2b4436] mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-base text-[#5c8a66]">
            {SITE} — semi-anarchy survival. No claims. No resets. PvP everywhere.
          </div>
        </footer>
        <ChatBubble />
      </body>
    </html>
  );
}
