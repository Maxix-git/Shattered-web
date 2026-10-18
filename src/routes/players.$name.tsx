import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/community-pages";
export const Route = createFileRoute("/players/$name")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.name} | Shattered SMP` },
      {
        name: "description",
        content: "Player stories, records, and community on Shattered SMP. Sample data preview.",
      },
      { property: "og:title", content: `${params.name} | Shattered SMP` },
      { property: "og:description", content: "Discover the people and stories of Shattered SMP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const params = Route.useParams();
  return <ProfilePage name={params.name} />;
}
