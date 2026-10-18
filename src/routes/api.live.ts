// GET /api/live — everything the public site renders, from the live database.
import { createFileRoute } from "@tanstack/react-router";
import { buildLive } from "@/server/live";

export const Route = createFileRoute("/api/live")({
  server: {
    handlers: {
      GET: async () => Response.json(await buildLive(), { headers: { "cache-control": "no-store" } }),
    },
  },
});
