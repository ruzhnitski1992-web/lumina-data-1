import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/casos-de-exito")({
  head: () => ({
    meta: [
      { title: "Casos de éxito en análisis de datos con IA | Lumina" },
      { name: "description", content: "Retos, soluciones y resultados. Casos ilustrativos hasta publicar casos reales." },
      { property: "og:title", content: "Casos de éxito en análisis de datos con IA | Lumina" },
      { property: "og:description", content: "Retos, soluciones y resultados. Casos ilustrativos hasta publicar casos reales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/casos-de-exito" }],
  }),
  component: () => <PageStub title="Casos de éxito" intro="Retos, soluciones y resultados. Casos ilustrativos hasta publicar casos reales." />,
});
