import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getRadar } from "@/lib/observatory.functions";
import { FreshnessBar, RadarList } from "@/components/observatory/Radar";

const t = "Observatorio de Robótica: novedades y normativa | Lumina";
const d = "Investigación reciente en robótica desde arXiv y guía clara del Reglamento de Máquinas, el Reglamento de IA y la ISO 10218.";

export const Route = createFileRoute("/robotica")({
  loader: () => getRadar({ data: { source: "arxiv-ro" } }),
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://luminadatainsights.com/robotica" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "https://luminadatainsights.com/robotica" }] }),
  component: Page,
});

const norms = [
  { n: "Reglamento (UE) 2023/1230 de máquinas", e: "Sustituye a la Directiva de Máquinas. Será aplicable desde el 20 de enero de 2027 e incorpora requisitos sobre software de seguridad, ciberseguridad y máquinas con comportamiento autónomo.", url: "https://eur-lex.europa.eu/eli/reg/2023/1230/oj" },
  { n: "Reglamento (UE) 2024/1689 de IA", e: "Los sistemas de IA que actúan como componente de seguridad de productos del Anexo I (como las máquinas) se consideran de alto riesgo, con obligaciones aplicables según su calendario.", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
  { n: "ISO 10218-1 e ISO 10218-2 (2025)", e: "Requisitos de seguridad para robots industriales y para su integración en células. La edición de 2025 incorpora los requisitos de robótica colaborativa de la antigua ISO/TS 15066.", url: "https://www.iso.org/standard/73933.html" },
];

function Page() {
  const { items, source, error } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-[1180px] px-5 pt-32 pb-20">
      <p className="text-sm font-semibold text-lp-blue">Observatorio de Robótica</p>
      <h1 className="mt-2 text-4xl font-extrabold text-lp-ink md:text-5xl">Robótica: investigación al día y normativa explicada</h1>
      <p className="mt-4 max-w-3xl text-lg text-lp-slate">Robots industriales, colaborativos, móviles, humanoides y drones: lo que se publica cada día y las normas que debes cumplir.</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-lp-ink">Regulación y normas</h2>
        <p className="mt-1 text-xs text-lp-muted">Última revisión: octubre de 2026. Explicación propia; no sustituye al texto oficial.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{norms.map((x) => (
          <article key={x.n} className="rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-lp-blue" /><h3 className="mt-2 font-bold text-lp-ink">{x.n}</h3><p className="mt-2 text-sm text-lp-slate">{x.e}</p>
            <a href={x.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lp-blue">Fuente oficial<ExternalLink className="h-3.5 w-3.5" /></a>
          </article>
        ))}</div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-bold text-lp-ink">Radar de investigación en robótica</h2>
        <FreshnessBar status={source} newest={items[0]?.published} />
        <div className="mt-6"><RadarList items={items} error={error} /></div>
      </section>
    </main>
  );
}
