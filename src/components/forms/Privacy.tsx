import privacyMd from "@/content/legal/privacidad.md?raw";
import { empresa } from "@/config/empresa";
import { basicPrivacyRows, inline } from "@/lib/legal-md";

const rows = basicPrivacyRows(privacyMd);

export function PrivacyInfoBox({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`mt-5 rounded-xl border p-4 text-xs ${dark ? "border-lp-on-dark/15 text-lp-on-dark/80" : "border-lp-line bg-lp-soft text-lp-slate"}`}>
      <p className={`mb-2 font-bold ${dark ? "text-lp-on-dark" : "text-lp-ink"}`}>Información básica sobre protección de datos</p>
      <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[150px_minmax(0,1fr)]">
        {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd>{inline(v)}</dd></div>))}
      </dl>
      <a href="/privacidad" className="mt-2 inline-block font-semibold text-lp-blue underline">Más información</a>
    </div>
  );
}

export function Check({ id, checked, onChange, required, children, dark }: { id: string; checked: boolean; onChange: (v: boolean) => void; required?: boolean; children: React.ReactNode; dark?: boolean }) {
  return (
    <label htmlFor={id} className={`flex items-start gap-2 text-sm ${dark ? "text-lp-on-dark/85" : "text-lp-slate"}`}>
      <input id={id} type="checkbox" checked={checked} required={required} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </label>
  );
}

export const PrivacyLink = () => <a href="/privacidad" className="underline">Política de privacidad</a>;
export const SensitiveNote = ({ dark }: { dark?: boolean }) => <p className={`mt-1 text-xs ${dark ? "text-lp-on-dark/60" : "text-lp-muted"}`}>No incluyas datos de salud ni otras categorías especiales de datos.</p>;

/** Registro del consentimiento de cada envío. Sin servidor todavía: se guarda en el navegador. */
export function logSubmission(form: string, checks: Record<string, boolean>) {
  const entry = { form, fecha: new Date().toISOString(), versionPolitica: empresa.versionPoliticas, casillas: checks };
  try {
    const log = JSON.parse(localStorage.getItem("lumina_form_log") || "[]");
    log.push(entry);
    localStorage.setItem("lumina_form_log", JSON.stringify(log.slice(-50)));
  } catch { /* ignore */ }
  return entry;
}
