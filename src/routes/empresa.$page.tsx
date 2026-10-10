import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";
import { company } from "@/lib/site-data";

export const Route = createFileRoute("/empresa/$page")({
  loader: ({ params }) => {
    const item = company.find((x) => x.href === `/empresa/${params.page}`);
    if (!item) throw notFound();
    return { title: item.label, desc: item.label ?? item.label, path: `/empresa/${params.page}` };
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
  return <PageStub section={{ label: "Empresa", href: "/empresa/sobre-nosotros" }} title={d.title} intro={d.desc} />;
}
