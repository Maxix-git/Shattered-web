import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardsPage } from "@/components/community-pages";
export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore leaderboards on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Leaderboards | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover leaderboards on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardsPage,
});
