import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/community-pages";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore overview on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Overview | Shattered SMP" },
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
