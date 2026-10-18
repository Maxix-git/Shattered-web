import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/components/community-pages";
export const Route = createFileRoute("/community/$postId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.postId} | Shattered SMP` },
      {
        name: "description",
        content: "Player stories, records, and community on Shattered SMP. Sample data preview.",
      },
      { property: "og:title", content: `${params.postId} | Shattered SMP` },
      { property: "og:description", content: "Discover the people and stories of Shattered SMP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const params = Route.useParams();
  return <PostPage id={params.postId} />;
}
