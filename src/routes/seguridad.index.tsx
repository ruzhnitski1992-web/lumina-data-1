import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/seguridad/")({
  head: () => ({
    meta: [
      { title: "Seguridad y privacidad del dato | Lumina" },
      { name: "description", content: "Arquitectura de seguridad, ciclo de vida del dato y supervisión humana de la IA." },
      { property: "og:title", content: "Seguridad y privacidad del dato | Lumina" },
      { property: "og:description", content: "Arquitectura de seguridad, ciclo de vida del dato y supervisión humana de la IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/seguridad" }],
  }),
  component: () => <PageStub title="Centro de Seguridad" intro="Arquitectura de seguridad, ciclo de vida del dato y supervisión humana de la IA." />,
});
