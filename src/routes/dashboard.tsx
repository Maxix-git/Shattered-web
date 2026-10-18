import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/community-pages";
export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore your dashboard on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Your dashboard | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover your dashboard on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});
