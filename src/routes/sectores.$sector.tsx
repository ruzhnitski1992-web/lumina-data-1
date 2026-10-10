import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";
import { sectors } from "@/lib/site-data";

export const Route = createFileRoute("/sectores/$sector")({
  loader: ({ params }) => {
    const item = sectors.find((x) => x.href === `/sectores/${params.sector}`);
    if (!item) throw notFound();
    return { title: item.label, desc: item.label ?? item.label, path: `/sectores/${params.sector}` };
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
  return <PageStub section={{ label: "Sectores", href: "/#sectores" }} title={d.title} intro={d.desc} />;
}
