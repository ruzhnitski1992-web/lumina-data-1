import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { empresa } from "@/config/empresa";
import { initConsent, readConsent, saveConsent } from "@/lib/consent";

const btn = "flex-1 rounded-lg bg-lp-blue px-2 py-2.5 text-sm sm:px-4 font-semibold text-lp-on-dark hover:shadow-glow";

function Switch({ id, label, checked, disabled, onChange, note }: { id: string; label: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-lp-line py-4">
      <label htmlFor={id} className="text-sm"><span className="font-semibold text-lp-ink">{label}</span>{note && <span className="block text-xs text-lp-muted">{note}</span>}</label>
      <button id={id} role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange?.(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-lp-blue" : "bg-lp-line"} ${disabled ? "opacity-60" : ""}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-lp-bg shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function CookieBanner() {
  const [banner, setBanner] = useState(false);
  const [modal, setModal] = useState(false);
  const [sel, setSel] = useState({ analisis: false, terceros: false });
  const dlg = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initConsent();
    if (!readConsent()) setBanner(true);
    const open = () => {
      const c = readConsent();
      setSel({ analisis: !!c?.analisis, terceros: !!c?.terceros });
      lastFocus.current = document.activeElement as HTMLElement;
      setModal(true);
    };
    window.addEventListener("lumina:cookies", open);
    return () => window.removeEventListener("lumina:cookies", open);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const el = dlg.current!;
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
    focusables()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      if (e.key === "Tab") {
        const f = focusables(); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [modal]);

  const close = () => { setModal(false); lastFocus.current?.focus?.(); };
  const save = (v: { analisis: boolean; terceros: boolean }) => { saveConsent(v); setBanner(false); close(); };
  const all = { analisis: empresa.usaAnalitica, terceros: empresa.usaMapa };
  const none = { analisis: false, terceros: false };

  return (
    <>
      {banner && !modal && (
        <section aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-h-[45vh] max-w-3xl overflow-y-auto rounded-2xl border border-lp-line bg-lp-bg p-4 sm:p-5 shadow-lp sm:inset-x-6" data-noprint>
          <button onClick={() => setBanner(false)} aria-label="Cerrar aviso (solo se usarán cookies necesarias)" className="absolute right-3 top-3 rounded p-1 text-lp-muted hover:text-lp-ink"><X className="h-4 w-4" /></button>
          <p className="pr-6 text-xs leading-relaxed text-lp-slate sm:text-sm">
            Usamos cookies propias necesarias para que el sitio funcione. Si nos das tu consentimiento, usaremos además cookies de análisis de Google Analytics para medir el uso del sitio, y las del mapa de Google Maps en la página de contacto. Puedes aceptarlas, rechazarlas o configurarlas. Responsable: {empresa.razonSocial}. Más información en la <a href="/cookies" className="text-lp-blue underline">Política de cookies</a>.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:flex">
            <button className={btn} onClick={() => save(all)}>Aceptar</button>
            <button className={btn} onClick={() => save(none)}>Rechazar</button>
            <button className={btn} onClick={() => { lastFocus.current = document.activeElement as HTMLElement; setModal(true); }}>Configurar</button>
          </div>
        </section>
      )}
      {modal && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-lp-navy/60 p-4" onClick={(e) => e.target === e.currentTarget && close()} data-noprint>
          <div ref={dlg} role="dialog" aria-modal="true" aria-labelledby="ck-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-lp-bg p-6 shadow-lp">
            <div className="flex items-center justify-between">
              <h2 id="ck-title" className="text-lg font-bold text-lp-ink">Configuración de cookies</h2>
              <button onClick={close} aria-label="Cerrar" className="rounded p-1 text-lp-muted hover:text-lp-ink"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4">
              <Switch id="ck-nec" label="Necesarias" note="Siempre activas" checked disabled />
              {empresa.usaAnalitica && <Switch id="ck-an" label="Análisis (Google Analytics)" checked={sel.analisis} onChange={(v) => setSel({ ...sel, analisis: v })} />}
              {empresa.usaMapa && <Switch id="ck-3p" label="Contenidos de terceros (Google Maps)" checked={sel.terceros} onChange={(v) => setSel({ ...sel, terceros: v })} />}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button className={btn} onClick={() => save(sel)}>Guardar selección</button>
              <button className={btn} onClick={() => save(all)}>Aceptar todas</button>
              <button className={btn} onClick={() => save(none)}>Rechazar todas</button>
            </div>
            <a href="/cookies" className="mt-4 inline-block text-sm text-lp-blue underline">Política de cookies</a>
          </div>
        </div>
      )}
    </>
  );
}
