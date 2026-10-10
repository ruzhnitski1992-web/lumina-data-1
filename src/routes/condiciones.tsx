import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import md from "@/content/legal/condiciones.md?raw";

const t = "Condiciones de uso | Lumina Data Insights";
const d = "Condiciones de uso de Lumina Data Insights: servicio, suscripciones con Paddle, usos permitidos y responsabilidad.";
export const Route = createFileRoute("/condiciones")({
  head: () => ({
    meta: [
      { title: t },
      { name: "description", content: d },
      { property: "og:title", content: t },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://luminadatainsights.com/condiciones" }],
  }),
  component: () => <LegalPage md={md} path="/condiciones" />,
});
