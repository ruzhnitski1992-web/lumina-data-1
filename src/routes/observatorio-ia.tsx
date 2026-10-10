import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { getRadar } from "@/lib/observatory.functions";
import { FreshnessBar, RadarList } from "@/components/observatory/Radar";
import { WebSearchBox } from "@/components/observatory/WebSearchBox";

const t = "Observatorio IA: novedades diarias de inteligencia artificial | Lumina";
const d = "Radar diario de investigación en inteligencia artificial desde arXiv, comparador de proveedores y calendario regulatorio europeo, con fuente y fecha.";

export const Route = createFileRoute("/observatorio-ia")({
  loader: () => getRadar({ data: { source: "arxiv-ai" } }),
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://luminadatainsights.com/observatorio-ia" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "https://luminadatainsights.com/observatorio-ia" }] }),
  component: Page,
});

const providers = [
  { p: "OpenAI", m: "Familia GPT", mod: "Texto, imagen, audio", url: "https://openai.com/api/pricing/" },
  { p: "Anthropic", m: "Familia Claude", mod: "Texto, imagen", url: "https://www.anthropic.com/pricing" },
  { p: "Google", m: "Familia Gemini", mod: "Texto, imagen, audio, vídeo", url: "https://ai.google.dev/pricing" },
  { p: "Mistral AI", m: "Mistral / Codestral", mod: "Texto", url: "https://mistral.ai/pricing" },
  { p: "Meta", m: "Llama (pesos abiertos)", mod: "Texto, imagen", url: "https://www.llama.com/" },
];

const regulation = [
  { f: "1 ago 2024", t: "Entrada en vigor del Reglamento (UE) 2024/1689 de IA" },
  { f: "2 feb 2025", t: "Prohibiciones de prácticas de IA y obligación de alfabetización en IA" },
  { f: "2 ago 2025", t: "Obligaciones para modelos de IA de uso general y gobernanza" },
  { f: "2 ago 2026", t: "Aplicación general, incluidos sistemas de alto riesgo del Anexo III (calendario sujeto a revisión normativa)" },
  { f: "2 ago 2027", t: "Sistemas de alto riesgo integrados en productos del Anexo I" },
];

function Page() {
  const { items, source, error } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-[1180px] px-5 pt-32 pb-20">
      <p className="text-sm font-semibold text-lp-blue">Observatorio IA</p>
      <h1 className="mt-2 text-4xl font-extrabold text-lp-ink md:text-5xl">Lo último en inteligencia artificial, con fuente y fecha</h1>
      <p className="mt-4 max-w-3xl text-lg text-lp-slate">Radar diario de investigación publicada en arXiv, comparador de proveedores y calendario del Reglamento europeo de IA.</p>
      <p className="mt-3 text-xs text-lp-muted">Contenido elaborado con ayuda de IA y revisado por nuestro equipo editorial. Los resúmenes son extractos breves; consulta siempre la fuente original.</p>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-lp-ink">Pregunta al Observatorio</h2>
        <WebSearchBox />
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-bold text-lp-ink">Radar de investigación</h2>
        <FreshnessBar status={source} newest={items[0]?.published} />
        <div className="mt-6"><RadarList items={items} error={error} /></div>
      </section>

      <section id="comparador" className="mt-14">
        <h2 className="text-2xl font-bold text-lp-ink">Comparador de proveedores</h2>
        <p className="mt-2 text-sm text-lp-muted">Precio orientativo: verifica siempre en la web del proveedor. Enlaces a sus páginas oficiales de precios.</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-lp-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-lp-blue/5 text-lp-ink"><tr><th className="p-3">Proveedor</th><th className="p-3">Modelos</th><th className="p-3">Modalidades</th><th className="p-3">Precios oficiales</th></tr></thead>
            <tbody>{providers.map((r) => (
              <tr key={r.p} className="border-t border-lp-line text-lp-slate"><td className="p-3 font-semibold text-lp-ink">{r.p}</td><td className="p-3">{r.m}</td><td className="p-3">{r.mod}</td>
                <td className="p-3"><a className="inline-flex items-center gap-1 font-semibold text-lp-blue" href={r.url} target="_blank" rel="noopener noreferrer">Ver precios<ExternalLink className="h-3.5 w-3.5" /></a></td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-lp-ink">Calendario del Reglamento de IA de la UE</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-5">{regulation.map((r) => (
          <li key={r.f} className="rounded-2xl border border-lp-line bg-lp-bg p-4 shadow-sm"><p className="font-bold text-lp-blue">{r.f}</p><p className="mt-1 text-sm text-lp-slate">{r.t}</p></li>
        ))}</ol>
        <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lp-blue">Fuente: EUR-Lex<ExternalLink className="h-3.5 w-3.5" /></a>
      </section>
    </main>
  );
}
