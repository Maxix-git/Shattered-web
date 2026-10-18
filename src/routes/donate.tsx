import { createFileRoute } from "@tanstack/react-router";
import { DonatePage } from "@/components/community-pages";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Fund the realm | Shattered SMP" },
      {
        name: "description",
        content: "Donations fund the Shattered SMP server. Ad-free browsing for donors, no pay-to-win.",
      },
    ],
  }),
  component: DonatePage,
});
