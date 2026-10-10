import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Database, BarChart3, ArrowRight, ExternalLink } from "lucide-react";
import { agents } from "@/lib/site-data";
import { agentProfile } from "@/lib/agent-profiles";
import { AgentActivator } from "@/components/site/AgentActivator";

export const Route = createFileRoute("/agentes/$slug")({
  loader: ({ params }) => {
    const item = agents.find((x) => x.slug === params.slug);
    if (!item) throw notFound();
    return { slug: item.slug, title: item.name, desc: item.mission };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "No encontrado | Lumina" }, { name: "robots", content: "noindex" }] };
    const t = `${/^agente/i.test(loaderData.title) ? loaderData.title.replace(/^agente/i, "Agente de IA") : `Agente de IA ${loaderData.title}`} | Lumina`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.desc },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://luminadatainsights.com/agentes/${loaderData.slug}` }],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useLoaderData();
  const agent = agents.find((x) => x.slug === slug)!;
  const p = agentProfile(agent);
  const Icon = agent.icon;
  return (
    <main className="pt-32 pb-20">
      <div className="mx-auto max-w-[1180px] px-5">
        <nav className="text-sm text-lp-muted">
          <Link to="/agentes" className="hover:text-lp-blue">Agentes IA</Link> / <span>{p.categoryName}</span>
        </nav>
        <header className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-lp-blue/10 text-lp-blue"><Icon className="h-10 w-10" /></div>
          <div>
            <h1 className="text-4xl font-extrabold text-lp-ink md:text-5xl">{agent.name}</h1>
            <p className="mt-3 max-w-3xl text-lg text-lp-slate">{agent.mission}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-lp-ok/10 px-3 py-1 text-sm font-semibold text-lp-ok">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lp-ok" />Entregable: {agent.deliverable}
            </p>
          </div>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-lp-line bg-lp-bg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-lp-ink">El problema</h2>
            <p className="mt-3 text-lp-slate">{p.problem}</p>
            <a href={p.reference.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lp-blue">
              Fuente: {p.reference.label}<ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="rounded-2xl border border-lp-line bg-lp-bg p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-lp-ink"><Database className="h-5 w-5 text-lp-blue" />Fuentes que analiza</h2>
            <ul className="mt-3 grid gap-2 text-lp-slate sm:grid-cols-2">{p.sources.map((s) => <li key={s}>• {s}</li>)}</ul>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-lp-line bg-lp-bg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-lp-ink">Soluciones que entrega</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-2">
            {p.solutions.map((s, i) => (
              <li key={s} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lp-ok" /><span className="text-lp-slate"><b className="text-lp-ink">Paso {i + 1}.</b> {s}</span></li>
            ))}
          </ol>
          <h3 className="mt-6 flex items-center gap-2 font-bold text-lp-ink"><BarChart3 className="h-5 w-5 text-lp-blue" />Indicadores que mide</h3>
          <div className="mt-3 flex flex-wrap gap-2">{p.kpis.map((k) => <span key={k} className="rounded-full border border-lp-line px-3 py-1 text-sm text-lp-slate">{k}</span>)}</div>
        </section>

        {p.related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-lp-ink">Trabaja junto a</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {p.related.map((r) => (
                <Link key={r.slug} to="/agentes/$slug" params={{ slug: r.slug }} className="flex items-center justify-between rounded-xl border border-lp-line bg-lp-bg p-4 text-sm font-semibold text-lp-ink transition hover:border-lp-blue hover:text-lp-blue">
                  {r.name}<ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <AgentActivator
          section={p.categoryName.toLowerCase()}
          options={[agent, ...p.related]}
          defaultAgent={agent.slug}
        />
      </div>
    </main>
  );
}
