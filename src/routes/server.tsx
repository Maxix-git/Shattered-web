import { createFileRoute } from "@tanstack/react-router";
import { ServerPage } from "@/components/community-pages";
export const Route = createFileRoute("/server")({
  head: () => ({
    meta: [
      { title: "Server panel | Shattered SMP" },
      { name: "description", content: "Server console, files, power and backups for Shattered SMP owners." },
      { property: "og:title", content: "Server panel | Shattered SMP" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServerPage,
});
