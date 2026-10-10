import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/accesibilidad")({
  head: () => ({
    meta: [
      { title: "Accesibilidad | Lumina Data Insights" },
      { name: "description", content: "Nuestro compromiso con WCAG 2.2 AA." },
      { property: "og:title", content: "Accesibilidad | Lumina Data Insights" },
      { property: "og:description", content: "Nuestro compromiso con WCAG 2.2 AA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/accesibilidad" }],
  }),
  component: () => <PageStub title="Declaración de accesibilidad" intro="Nuestro compromiso con WCAG 2.2 AA." />,
});
