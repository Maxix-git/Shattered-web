# Shattered SMP website v0.4.0 (Lovable design, live backend)

Built on the Shattered-smp-site (Lovable/TanStack Start) design. Reads the SAME
data.db the Discord bot and the Shattered plugin write to. One source of truth.

## Architecture change in v0.5: stateless site, bot owns the database

The site no longer reads SQLite directly. The Discord bot owns data.db and serves
it over an authenticated API (POST /api/site/rpc, Bearer WEBSITE_API_KEY). This
site build has ZERO native dependencies (no better-sqlite3) and deploys to Vercel.

Required env vars (Vercel project settings):
- SITE_API_URL: https://shattered-api.onrender.com (the Shattered API on Render)
- SITE_API_KEY: the SAME value as SITE_API_KEY set in the API's env on Render
- SESSION_SECRET: random string (signs session cookies)
- DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET: from the Discord developer portal
- DISCORD_CALLBACK_URL / PUBLIC_HOST: https://shatteredsmp.vercel.app (set in portal too)
- ADMIN_DISCORD_IDS: your Discord ID
- MC_HOST / MC_PORT: the Minecraft server (optional — the site pings it itself)

The API side (Render) needs these NEW env vars:
- SITE_API_KEY: the shared secret above (32+ hex chars)
- ASSISTANT_NAME: Shard
- DATABASE_URL: your Neon PostgreSQL connection string (migrations run on deploy)
- SITE_API_URL: https://shattered-api.onrender.com (the Render API)
- SITE_API_KEY: the same WEBSITE_API_KEY set in the bot's .env
- SESSION_SECRET: random string (signs session cookies)
- DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET: from the Discord developer portal
- DISCORD_CALLBACK_URL / PUBLIC_HOST: https://yourdomain (set in portal too)
- ADMIN_DISCORD_IDS: your Discord ID
- MC_HOST / MC_PORT: the Minecraft server (the site pings it itself)

Deploy: npm install, then `vercel` from this folder (NITRO_PRESET=vercel build is
already configured). The site shows an honest empty state if the bot is unreachable;
the homepage status badge keeps working because the MC ping stays site-side.

## What's in this version (v0.4.1)
- All sample/fake data removed; every number comes from the live DB
- Removed: store/shop (pay-to-win vibes), world map, chat assistant bubble
- Fixed: mobile hamburger menu (backdrop, tap-outside, ESC, closes on nav)
- Honor system: kills, streaks, playtime, bounty claims. Earned, never bought
- Bounty board: post a mark for 100 Honor; the killer claims +50; environmental
  deaths don't count; one claim only; revenge + bounty notifications
- Live kill feed on the front page (30s refresh), death zones (top kill areas)
- Faction owner controls: edit tag/description, announce, kick members, disband
  (syncs via the outbox to the plugin; announcements mirror to the faction's
  private Discord channel via the site_announcements table)
- Community wall with Discord-auth posting (30s rate limit), reports & appeals
- Donations: subtle sidebar sponsor note for non-donors; 30 days ad-free per
  donation; admin records donations; funding page with no pay-to-win
- Discord OAuth login only (no Minecraft auth), HMAC cookie sessions + CSRF

## Run it (Termux / Node 22+)
1. Unzip next to your shattered-website folder.
2. Copy the compiled sqlite binding (you already have it):
   mkdir -p node_modules
   cp -r ~/Shattered/shattered-website/node_modules/better-sqlite3 node_modules/
3. Start:
   DB_PATH=~/Shattered/discord-bot/data.db PORT=3000 SESSION_SECRET=<long-random-string> node .output/server/index.mjs
   Optional env: MC_HOST / MC_PORT (live server ping), DISCORD_CLIENT_ID,
   DISCORD_CLIENT_SECRET, PUBLIC_HOST (for the OAuth callback), ADMIN_DISCORD_IDS
4. Discord OAuth setup (for sign-in): create an app at discord.com/developers,
   add redirect  https://YOUR-DOMAIN/auth/callback  and set the env vars above.

## Notes
- The build output (.output) is included, so no npm install is needed to run.
- Rebuilding from source: NITRO_PRESET=node-server npm run build
- v0.4.1: the sync loop is COMPLETE. The Shattered plugin (BotSync module,
  Paper 26.2 / Java 25) now handles bounty, bounty_claimed and faction_announce:
  marked players get a "MARKED FOR DEATH" title in-game, claims broadcast,
  faction announcements broadcast in-game. The bot mirrors site announcements to
  the faction's private Discord channel. All 92 bot tests pass.
