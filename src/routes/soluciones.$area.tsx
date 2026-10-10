import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";
import { solutionAreas } from "@/lib/site-data";

export const Route = createFileRoute("/soluciones/$area")({
  loader: ({ params }) => {
    const item = solutionAreas.find((x) => x.href === `/soluciones/${params.area}`);
    if (!item) throw notFound();
    return { title: item.label, desc: item.desc ?? item.label, path: `/soluciones/${params.area}` };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "No encontrado | Lumina" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.title} | Lumina Data Insights`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.desc },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: loaderData.path }],
    };
  },
  component: Page,
});

function Page() {
  const d = Route.useLoaderData();
  return <PageStub section={{ label: "Soluciones", href: "/#como-funciona" }} title={d.title} intro={d.desc} />;
}
