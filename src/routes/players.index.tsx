import { createFileRoute } from "@tanstack/react-router";
import { PlayersPage } from "@/components/community-pages";
export const Route = createFileRoute("/players/")({
  head: () => ({
    meta: [
      { title: "Players | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore players on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Players | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover players on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayersPage,
});
