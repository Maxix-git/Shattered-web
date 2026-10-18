import { createFileRoute } from "@tanstack/react-router";
import { BountiesPage } from "@/components/community-pages";

export const Route = createFileRoute("/bounties")({
  head: () => ({
    meta: [
      { title: "Bounty board | Shattered SMP" },
      {
        name: "description",
        content: "Honor-based bounty board for the Shattered SMP anarchy server.",
      },
    ],
  }),
  component: BountiesPage,
});
