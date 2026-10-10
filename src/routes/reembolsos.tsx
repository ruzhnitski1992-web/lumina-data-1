import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import md from "@/content/legal/reembolsos.md?raw";

const t = "Política de reembolsos | Lumina Data Insights";
const d = "3 días de prueba gratis y garantía de devolución de 30 días en todas las suscripciones de Lumina.";
export const Route = createFileRoute("/reembolsos")({
  head: () => ({
    meta: [
      { title: t },
      { name: "description", content: d },
      { property: "og:title", content: t },
      { property: "og:description", content: d },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://luminadatainsights.com/reembolsos" }],
  }),
  component: () => <LegalPage md={md} path="/reembolsos" />,
});
