import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/community-pages";
export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Server status | Shattered SMP" },
      {
        name: "description",
        content:
          "Explore server status on Shattered SMP, an anarchy survival community. Preview experience with sample data.",
      },
      { property: "og:title", content: "Server status | Shattered SMP" },
      {
        property: "og:description",
        content: "Your world, your rivals, your legacy. Discover server status on Shattered SMP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatusPage,
});
