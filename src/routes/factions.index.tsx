import { createFileRoute } from "@tanstack/react-router";
import { FactionsPage } from "@/components/community-pages";
export const Route = createFileRoute("/factions/")({
  head: () => ({
    meta: [
      { title: "Factions | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore factions on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Factions | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover factions on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FactionsPage,
});
