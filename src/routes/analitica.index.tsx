import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/analitica/")({
  head: () => ({
    meta: [
      { title: "Analítica de datos con IA: de descriptiva a predictiva | Lumina" },
      { name: "description", content: "De la analítica descriptiva a la cognitiva: técnicas, preguntas que responden y agentes que las ejecutan." },
      { property: "og:title", content: "Analítica de datos con IA: de descriptiva a predictiva | Lumina" },
      { property: "og:description", content: "De la analítica descriptiva a la cognitiva: técnicas, preguntas que responden y agentes que las ejecutan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://luminadatainsights.com/analitica" }],
  }),
  component: () => <PageStub title="Analítica de datos con inteligencia artificial" intro="De la analítica descriptiva a la cognitiva: técnicas, preguntas que responden y agentes que las ejecutan." />,
});
