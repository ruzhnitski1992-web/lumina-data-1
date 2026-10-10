import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { webSearch, type WebResult } from "@/lib/websearch.functions";

export function WebSearchBox() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ results: WebResult[]; fetchedAt: string; error: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { setRes(await webSearch({ data: { query: q } })); } catch (err) { setRes({ results: [], fetchedAt: "", error: (err as Error).message }); } finally { setBusy(false); }
  };
  return (
    <div className="rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-sm">
      <form onSubmit={go} className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej.: últimos lanzamientos de modelos de IA" aria-label="Buscar en la web" className="flex-1 rounded-lg border border-lp-line bg-lp-bg px-3 py-2" />
        <button disabled={busy || q.trim().length < 3} className="inline-flex items-center gap-1 rounded-lg bg-lp-blue px-4 py-2 font-semibold text-lp-on-dark disabled:opacity-50"><Search className="h-4 w-4" />{busy ? "Buscando…" : "Buscar"}</button>
      </form>
      {res?.error && <p className="mt-3 text-sm text-lp-alert">{res.error}</p>}
      {res && !res.error && (
        <>
          <p className="mt-3 text-xs text-lp-muted">Información actualizada a: {new Date(res.fetchedAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })} · Resultados del último mes</p>
          <ul className="mt-3 space-y-3">{res.results.map((r) => (
            <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-lp-blue">{r.title}<ExternalLink className="h-3.5 w-3.5" /></a>
              <p className="text-sm text-lp-slate">{r.snippet}</p>{r.date && <p className="text-xs text-lp-muted">{r.date}</p>}</li>
          ))}</ul>
        </>
      )}
    </div>
  );
}
