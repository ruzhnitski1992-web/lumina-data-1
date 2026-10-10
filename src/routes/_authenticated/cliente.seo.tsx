import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { auditSeo, keywordIdeas, type KeywordIdea, type SeoAudit } from "@/lib/seo-audit.functions";
import { pageHead } from "@/lib/meta";
import { SearchConsolePanel } from "@/components/seo/SearchConsolePanel";

export const Route = createFileRoute("/_authenticated/cliente/seo")({
  head: () => pageHead("Análisis SEO de tu web", "Escribe la dirección de tu web y recibe tu puntuación SEO con los arreglos listos para aplicar."),
  component: Page,
});

function Page() {
  const run = useServerFn(auditSeo);
  const ideas = useServerFn(keywordIdeas);
  const [kw, setKw] = useState<KeywordIdea[] | null>(null);
  const [kwErr, setKwErr] = useState("");
  const [url, setUrl] = useState("");
  const [r, setR] = useState<SeoAudit | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    setKw(null); setKwErr("");
    ideas({ data: { url } }).then(setKw).catch((x) => setKwErr(x instanceof Error ? x.message : "Sin ideas de Google Ads."));
    try { setR(await run({ data: { url } })); } catch (x) { setErr(x instanceof Error ? x.message : "No se pudo analizar."); setR(null); } finally { setBusy(false); }
  };
  const fallos = r?.checks.filter((c) => !c.ok).sort((a, b) => Number(b.grave) - Number(a.grave)) ?? [];
  return (
    <main className="mx-auto max-w-[1000px] px-4 pt-28 pb-20 sm:px-5 sm:pt-36">
      <Link to="/app" className="text-sm text-lp-blue">← Centro de análisis</Link>
      <h1 className="mt-3 text-3xl font-extrabold text-lp-ink sm:text-4xl">Análisis SEO de tu web</h1>
      <p className="mt-3 text-lp-slate">Escribe la dirección de tu web. Los agentes revisan 18 puntos que Google tiene en cuenta y te dan cada arreglo listo para copiar.</p>
      <form onSubmit={go} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="tuempresa.com" inputMode="url" className="min-w-0 flex-1 rounded-lg border border-lp-line bg-lp-bg px-4 py-3" />
        <button disabled={busy} className="rounded-lg bg-lp-blue px-6 py-3 font-semibold text-lp-on-dark disabled:opacity-60">{busy ? "Analizando…" : "Analizar"}</button>
      </form>
      {err && <p role="alert" className="mt-4 text-destructive">{err}</p>}
      {r && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
            <div className="rounded-2xl border border-lp-line p-5 text-center">
              <p className="text-xs uppercase text-lp-muted">Puntuación SEO</p>
              <p className={`text-5xl font-extrabold ${r.puntuacion >= 80 ? "text-lp-blue" : r.puntuacion >= 50 ? "text-lp-ink" : "text-destructive"}`}>{r.puntuacion}</p>
              <p className="text-xs text-lp-muted">de 100</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-lp-line p-5 text-sm text-lp-slate">
              <p className="truncate"><strong className="text-lp-ink">Web:</strong> {r.final}</p>
              <p className="mt-1"><strong className="text-lp-ink">Título:</strong> {r.resumen.title || "—"}</p>
              <p className="mt-1"><strong className="text-lp-ink">Descripción:</strong> {r.resumen.description || "—"}</p>
              <p className="mt-1">{r.resumen.palabras} palabras · {r.resumen.enlaces} enlaces · {r.resumen.imagenes} imágenes · {r.ms} ms</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-lp-ink">Qué arreglar primero ({fallos.length})</h2>
            {fallos.length === 0 && <p className="mt-2 text-lp-slate">¡Todo correcto en los 18 puntos!</p>}
            <ul className="mt-3 space-y-3">
              {fallos.map((c) => (
                <li key={c.id} className={`rounded-xl border p-4 ${c.grave ? "border-destructive" : "border-lp-line"}`}>
                  <p className="font-semibold text-lp-ink">{c.grave ? "Importante · " : ""}{c.titulo}</p>
                  <p className="text-sm text-lp-slate">{c.detalle}</p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-lp-line/40 p-3 text-xs text-lp-ink">{c.arreglo}</pre>
                  <button className="mt-2 text-xs text-lp-blue" onClick={() => navigator.clipboard.writeText(c.arreglo)}>Copiar arreglo</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-lp-ink">Palabras clave que más busca la gente (Google Ads)</h2>
            <p className="mt-1 text-sm text-lp-slate">Datos reales del Planificador de palabras clave de Google para España. Úsalas en títulos, encabezados y textos para mejorar tu posicionamiento.</p>
            {kwErr && <p className="mt-2 text-sm text-destructive">{kwErr}</p>}
            {!kw && !kwErr && <p className="mt-2 text-sm text-lp-muted">Buscando en Google Ads…</p>}
            {kw && <div className="mt-3 overflow-x-auto rounded-xl border border-lp-line"><table className="w-full min-w-[480px] text-left text-sm"><thead><tr className="text-lp-muted"><th className="p-3">Búsqueda</th><th>Búsquedas/mes</th><th>Competencia</th><th>Coste por clic</th></tr></thead><tbody>{kw.map((k) => <tr key={k.texto} className="border-t border-lp-line"><td className="p-3 text-lp-ink">{k.texto}</td><td>{k.busquedas.toLocaleString("es-ES")}</td><td>{k.competencia}</td><td>{k.cpcMin != null && k.cpcMax != null ? `${k.cpcMin.toFixed(2)}–${k.cpcMax.toFixed(2)} €` : "—"}</td></tr>)}</tbody></table></div>}
          </div>
          <details className="rounded-xl border border-lp-line p-4">
            <summary className="cursor-pointer font-semibold text-lp-ink">Puntos correctos ({r.checks.length - fallos.length})</summary>
            <ul className="mt-2 space-y-1 text-sm text-lp-slate">{r.checks.filter((c) => c.ok).map((c) => <li key={c.id}>✓ {c.titulo} — {c.detalle}</li>)}</ul>
          </details>
        </section>
      )}
      <SearchConsolePanel />
    </main>
  );
}
