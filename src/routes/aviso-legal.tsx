import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import md from "@/content/legal/aviso-legal.md?raw";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal | Lumina Data Insights" },
      { name: "description", content: "Información legal del titular del sitio web Lumina Data Insights conforme al artículo 10 de la LSSI-CE." },
      { property: "og:title", content: "Aviso legal | Lumina Data Insights" },
      { property: "og:description", content: "Información legal del titular del sitio web Lumina Data Insights conforme al artículo 10 de la LSSI-CE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/aviso-legal" }],
  }),
  component: () => <LegalPage md={md} path="/aviso-legal" />,
});
