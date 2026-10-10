import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Download } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COUNTRIES, INDICATORS, getWorldBank } from "@/lib/observatory.functions";

const t = "Datos mundiales: PIB, inflación, empleo e I+D | Lumina";
const d = "Compara indicadores económicos oficiales del Banco Mundial entre países, con fuente, fecha de actualización y descarga en CSV.";
type Ind = keyof typeof INDICATORS;
type C = keyof typeof COUNTRIES;
const colors = ["var(--lp-blue)", "var(--lp-cyan)", "var(--lp-ok)", "var(--lp-alert)", "var(--lp-ink)", "var(--lp-muted)"];

export const Route = createFileRoute("/datos-mundiales")({
  loader: () => getWorldBank({ data: { indicator: "NY.GDP.MKTP.KD.ZG", countries: ["ESP", "FRA", "DEU", "EUU"] } }),
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://luminadatainsights.com/datos-mundiales" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "https://luminadatainsights.com/datos-mundiales" }] }),
  component: Page,
});

function Page() {
  const initial = Route.useLoaderData();
  const [ind, setInd] = useState<Ind>("NY.GDP.MKTP.KD.ZG");
  const [cs, setCs] = useState<C[]>(["ESP", "FRA", "DEU", "EUU"]);
  const [res, setRes] = useState(initial);
  const [loading, setLoading] = useState(false);

  const load = async (i: Ind, c: C[]) => {
    if (!c.length) return;
    setLoading(true);
    try { setRes(await getWorldBank({ data: { indicator: i, countries: c } })); } finally { setLoading(false); }
  };
  const toggle = (c: C) => { const n = cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c].slice(0, 6); setCs(n); load(ind, n); };

  const years = [...new Set(res.series.flatMap((s) => s.points.map((p) => p.year)))].sort();
  const rows = years.map((y) => Object.fromEntries([["year", y], ...res.series.map((s) => [s.country, s.points.find((p) => p.year === y)?.value ?? null])]));
  const csv = () => {
    const head = ["año", ...res.series.map((s) => COUNTRIES[s.country as C])].join(";");
    const body = rows.map((r) => [r.year, ...res.series.map((s) => r[s.country] ?? "")].join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([head + "\n" + body], { type: "text/csv" }));
    a.download = `${ind}.csv`; a.click();
  };

  return (
    <main className="mx-auto max-w-[1180px] px-5 pt-32 pb-20">
      <p className="text-sm font-semibold text-lp-blue">Datos mundiales</p>
      <h1 className="mt-2 text-4xl font-extrabold text-lp-ink md:text-5xl">Indicadores oficiales, comparados al instante</h1>
      <p className="mt-4 max-w-3xl text-lg text-lp-slate">Datos del Banco Mundial consultados en directo. Elige indicador y países.</p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-sm">
        <label className="text-sm font-semibold text-lp-ink">Indicador
          <select value={ind} onChange={(e) => { const v = e.target.value as Ind; setInd(v); load(v, cs); }} className="mt-1 block w-full rounded-lg border border-lp-line bg-lp-bg p-2 font-normal">
            {Object.entries(INDICATORS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">{(Object.keys(COUNTRIES) as C[]).map((c) => (
          <button key={c} onClick={() => toggle(c)} aria-pressed={cs.includes(c)} className={`rounded-full border px-3 py-1 text-sm ${cs.includes(c) ? "border-lp-blue bg-lp-blue text-lp-on-dark" : "border-lp-line text-lp-slate"}`}>{COUNTRIES[c]}</button>
        ))}</div>
      </div>

      <section className="mt-6 rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-lp-ink">{INDICATORS[ind]}{loading && <span className="ml-2 text-sm font-normal text-lp-muted">Cargando…</span>}</h2>
          <button onClick={csv} className="inline-flex items-center gap-1 rounded-lg border border-lp-line px-3 py-1.5 text-sm font-semibold text-lp-ink hover:border-lp-blue"><Download className="h-4 w-4" />Descargar CSV</button>
        </div>
        {res.error ? <p className="mt-4 text-sm text-lp-alert">{res.error}</p> : (
          <div className="mt-4 h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}><CartesianGrid strokeDasharray="3 3" stroke="var(--lp-line)" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Legend />
                {res.series.map((s, i) => <Line key={s.country} dataKey={s.country} name={COUNTRIES[s.country as C]} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} connectNulls />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-3 text-sm text-lp-slate">Fuente: Banco Mundial · Guardado y actualizado automáticamente cada día · Última sincronización: {res.lastUpdated ? new Date(res.lastUpdated).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }) : "—"} ·{" "}
          <a href={res.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-lp-blue">Dato original<ExternalLink className="h-3.5 w-3.5" /></a></p>
      </section>
    </main>
  );
}
