import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { publicAudit, type PublicAudit } from "@/lib/public-audit.functions";

const tone = (n: number) => (n >= 80 ? "bg-lp-ok" : n >= 50 ? "bg-lp-warn" : "bg-lp-alert");
const toneText = (n: number) => (n >= 80 ? "text-lp-ok" : n >= 50 ? "text-lp-warn" : "text-lp-alert");

export function UrlAudit() {
  const run = useServerFn(publicAudit);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<PublicAudit | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setBusy(true); setErr(""); setRes(null);
    try { setRes(await run({ data: { url } })); }
    catch (x) { setErr(x instanceof Error ? x.message : "No se pudo completar la auditoría."); }
    finally { setBusy(false); }
  }

  return (
    <div className="mt-8 max-w-xl rounded-xl border border-lp-line bg-lp-bg p-4 shadow-lp">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">Escribe la web de tu empresa</label>
        <input id="audit-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Escribe la web de tu empresa" inputMode="url" autoComplete="url"
          className="min-w-0 flex-1 rounded-lg border border-lp-line bg-lp-bg px-4 py-3 text-lp-ink outline-none focus:border-lp-blue" />
        <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-lp-ink px-5 py-3 font-semibold text-lp-on-dark disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{busy ? "Auditando…" : "Auditar gratis"}
        </button>
      </form>
      <p className="mt-2 text-[11px] text-lp-muted">Comprobaciones automáticas sobre información pública. No constituye una auditoría de seguridad completa. Máx. 3 al día.</p>
      {busy && <p className="mt-3 text-sm text-lp-slate">Revisando seguridad, velocidad, SEO, correo y cookies… (hasta 60 s)</p>}
      {err && <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-lp-alert"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{err}</p>}
      {res && (
        <div className="mt-4" aria-live="polite">
          <div className="flex items-center gap-4">
            <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-current text-xl font-extrabold ${toneText(res.puntuacion)}`}>{res.puntuacion}</div>
            <div className="min-w-0"><p className="font-bold text-lp-ink">Puntuación global de 0 a 100</p><p className="truncate text-xs text-lp-muted">{res.url}</p></div>
          </div>
          <ul className="mt-4 space-y-2">
            {res.areas.map((a) => (
              <li key={a.key} className="flex items-start gap-2 text-sm">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${tone(a.nota)}`} aria-hidden />
                <span className="min-w-0"><b className="text-lp-ink">{a.nombre} · {a.nota}</b><span className="block text-xs text-lp-muted">{a.detalle}</span></span>
              </li>
            ))}
          </ul>
          {res.problemas.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold text-lp-ink">Los {res.problemas.length} problemas más importantes</p>
              <ol className="mt-2 space-y-2">
                {res.problemas.map((p, i) => (
                  <li key={i} className="rounded-lg border border-lp-line p-3 text-sm"><b className="text-lp-ink">{i + 1}. {p.titulo}</b><p className="mt-1 text-lp-slate">{p.explicacion}</p></li>
                ))}
              </ol>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/suscripciones" className="rounded-lg bg-lp-blue px-4 py-2 text-sm font-semibold text-lp-on-dark">Que los agentes lo arreglen · Ver planes</a>
          </div>
        </div>
      )}
    </div>
  );
}
