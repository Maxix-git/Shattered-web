import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/community-pages";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shattered SMP — semi-anarchy survival" },
      {
        name: "description",
        content:
          "Explore overview on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Shattered SMP — semi-anarchy survival" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover overview on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});
