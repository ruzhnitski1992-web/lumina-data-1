import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import md from "@/content/legal/cookies.md?raw";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies | Lumina Data Insights" },
      { name: "description", content: "Qué cookies usa Lumina Data Insights, para qué y cómo gestionar tu consentimiento." },
      { property: "og:title", content: "Política de cookies | Lumina Data Insights" },
      { property: "og:description", content: "Qué cookies usa Lumina Data Insights, para qué y cómo gestionar tu consentimiento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => <LegalPage md={md} path="/cookies" />,
});
