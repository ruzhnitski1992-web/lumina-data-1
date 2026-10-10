import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import md from "@/content/legal/privacidad.md?raw";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad | Lumina Data Insights" },
      { name: "description", content: "Cómo trata Lumina Data Insights tus datos personales conforme al RGPD y la LOPDGDD." },
      { property: "og:title", content: "Política de privacidad | Lumina Data Insights" },
      { property: "og:description", content: "Cómo trata Lumina Data Insights tus datos personales conforme al RGPD y la LOPDGDD." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacidad" }],
  }),
  component: () => <LegalPage md={md} path="/privacidad" />,
});
