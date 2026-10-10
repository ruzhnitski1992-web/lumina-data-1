import { ExternalLink, AlertTriangle } from "lucide-react";
import type { RadarItem, SourceStatus } from "@/lib/observatory.functions";

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid" }) : "");

export function FreshnessBar({ status, newest }: { status: SourceStatus | null; newest?: string | undefined }) {
  const old = newest && Date.now() - new Date(newest).getTime() > 30 * 864e5;
  if (!status) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-lp-line bg-lp-bg px-4 py-3 text-sm text-lp-slate">
      <span className={`h-2.5 w-2.5 rounded-full ${status.status === "ok" ? "bg-lp-ok" : "bg-lp-alert"}`} aria-hidden />
      <span><b className="text-lp-ink">Información actualizada a:</b> {status.lastSynced ? fmt(status.lastSynced) : "pendiente"}</span>
      <span>· Fuente: {status.name}</span>
      <span>· {status.itemCount} elementos guardados</span>
      <span className="text-xs text-lp-muted">Se actualiza automáticamente</span>
      {status.status === "error" && <span className="text-lp-alert">Última actualización con incidencias; mostramos lo guardado.</span>}
      {old && <span className="flex items-center gap-1 font-semibold text-lp-alert"><AlertTriangle className="h-4 w-4" />Puede haber información más reciente</span>}
    </div>
  );
}

export function RadarList({ items, error }: { items: RadarItem[]; error?: string | null }) {
  if (error) return <p className="rounded-xl border border-lp-alert/30 bg-lp-alert/5 p-4 text-sm text-lp-alert">{error}. Vuelve a cargar la página en unos minutos.</p>;
  if (!items.length) return <p className="text-lp-slate">No hay novedades en este momento.</p>;
  return (
    <ol className="relative mt-2 space-y-4 border-l-2 border-lp-blue/20 pl-6">
      {items.map((it) => (
        <li key={it.id} className="relative rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lp">
          <span className="absolute -left-[33px] top-6 h-3.5 w-3.5 rounded-full border-2 border-lp-bg bg-lp-blue" aria-hidden />
          <div className="flex flex-wrap items-center gap-2 text-xs text-lp-muted">
            <span className="rounded-full bg-lp-blue/10 px-2 py-0.5 font-semibold text-lp-blue">{it.category}</span>
            <time dateTime={it.published}>{fmt(it.published)}</time>
            <span>· {it.authors}</span>
          </div>
          <h3 className="mt-2 font-bold text-lp-ink">{it.title}</h3>
          <p className="mt-1 text-sm text-lp-slate">{it.summary}</p>
          <a href={it.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-lp-blue">Leer en arXiv<ExternalLink className="h-3.5 w-3.5" /></a>
        </li>
      ))}
    </ol>
  );
}
