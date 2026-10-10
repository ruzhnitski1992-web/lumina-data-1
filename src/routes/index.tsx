import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { SectorsStrip, StatsBand, ProcessSteps, AgentDebate, AgentsPreview, MaturityStairs, Cases, Security, Comparison, FAQ, faqs } from "@/components/home/Sections";
import { UploadZone } from "@/components/home/UploadZone";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Plans } from "./suscripciones";

const title = "Agentes de IA para empresas | Análisis de datos – Lumina";
const description = "Agentes de IA que analizan tus correos, facturas y documentos para detectar pérdidas y oportunidades de negocio. Pruébalo gratis.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://luminadatainsights.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://luminadatainsights.com/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }),
    }],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <SectorsStrip />
      <StatsBand />
      <section id="como-funciona" aria-label="Cómo funciona" className="scroll-mt-20 bg-lp-alt py-24">
        <ProcessSteps />
        <UploadZone />
      </section>
      <AgentDebate />
      <AgentsPreview />
      <MaturityStairs />
      <Cases />
      <Security />
      <Comparison />
      <FAQ />
      <Plans />
      <FinalCTA />
    </main>
  );
}
