import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/agentes/")({
  head: () => ({
    meta: [
      { title: "40 agentes de IA para empresas: catálogo | Lumina" },
      { name: "description", content: "Finanzas, ventas, operaciones, cumplimiento y SEO: conoce los 40 agentes de inteligencia artificial de Lumina y qué entrega cada uno." },
      { property: "og:title", content: "40 agentes de IA para empresas: catálogo | Lumina" },
      { property: "og:description", content: "Finanzas, ventas, operaciones, cumplimiento y SEO: conoce los 40 agentes de inteligencia artificial de Lumina y qué entrega cada uno." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://luminadatainsights.com/agentes" }],
  }),
  component: () => <PageStub title="Catálogo de agentes de IA para empresas" intro="Más de 40 agentes de IA especializados en finanzas, clientes, operaciones, riesgo y SEO, coordinados en un único enjambre." />,
});
