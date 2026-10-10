import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";
import { analytics } from "@/lib/site-data";

export const Route = createFileRoute("/analitica/$tipo")({
  loader: ({ params }) => {
    const item = analytics.find((x) => x.href === `/analitica/${params.tipo}`);
    if (!item) throw notFound();
    return { title: item.label, desc: item.desc ?? item.label, path: `/analitica/${params.tipo}` };
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
  return <PageStub section={{ label: "Analítica", href: "/analitica" }} title={d.title} intro={d.desc} />;
}
