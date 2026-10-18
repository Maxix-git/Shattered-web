import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/components/community-pages";
export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore community on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Community | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover community on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});
