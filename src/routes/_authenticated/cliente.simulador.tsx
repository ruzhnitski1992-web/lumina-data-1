import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { pageHead } from "@/lib/meta";

export const Route = createFileRoute("/_authenticated/cliente/simulador")({
  head: () => pageHead("Simulador de decisiones", "Calcula el impacto de subir precios, contratar o invertir en publicidad en ventas, margen, caja y punto de equilibrio."),
  component: Page,
});

const eur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const pct = (n: number) => `${n.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;

type Field = { k: keyof Base; label: string; min: number; max: number; step: number; unit: string };
type Base = { ventas: number; margen: number; fijos: number; elasticidad: number; precio: number; publi: number; roas: number; contratacion: number; ventasComercial: number };

const baseFields: Field[] = [
  { k: "ventas", label: "Ventas mensuales actuales", min: 1000, max: 500000, step: 500, unit: "€" },
  { k: "margen", label: "Margen bruto actual", min: 5, max: 90, step: 1, unit: "%" },
  { k: "fijos", label: "Costes fijos mensuales", min: 0, max: 300000, step: 500, unit: "€" },
  { k: "elasticidad", label: "Elasticidad precio estimada", min: 0.2, max: 3, step: 0.1, unit: "" },
];
const decisionFields: Field[] = [
  { k: "precio", label: "Cambio de precios", min: -20, max: 20, step: 1, unit: "%" },
  { k: "publi", label: "Inversión extra en publicidad al mes", min: 0, max: 20000, step: 100, unit: "€" },
  { k: "roas", label: "Ventas generadas por cada € de publicidad", min: 0, max: 8, step: 0.1, unit: "€" },
  { k: "contratacion", label: "Coste anual de nueva contratación", min: 0, max: 80000, step: 1000, unit: "€" },
  { k: "ventasComercial", label: "Ventas extra al mes que aportaría", min: 0, max: 50000, step: 500, unit: "€" },
];

function calc(b: Base, factor: number) {
  const p = b.precio / 100;
  const m = b.margen / 100;
  const volumen = Math.max(0, 1 - b.elasticidad * p * (factor < 1 ? 1.3 : factor > 1 ? 0.7 : 1));
  const ventasBase = b.ventas * (1 + p) * volumen;
  const extra = (b.publi * b.roas + b.ventasComercial) * factor;
  const ventas = ventasBase + extra;
  const margenUnit = (m + p) / (1 + p);
  const margenBruto = ventasBase * margenUnit + extra * m;
  const fijos = b.fijos + b.publi + b.contratacion / 12;
  const caja = margenBruto - fijos;
  const equilibrio = margenUnit > 0 ? fijos / margenUnit : Infinity;
  return { ventas, margenBruto, caja, equilibrio };
}

function Page() {
  const [b, setB] = useState<Base>({ ventas: 40000, margen: 40, fijos: 12000, elasticidad: 1.2, precio: 5, publi: 1000, roas: 3, contratacion: 0, ventasComercial: 0 });
  const [saved, setSaved] = useState<{ nombre: string; b: Base }[]>([]);
  const [ver, setVer] = useState(false);
  const actual = useMemo(() => calc({ ...b, precio: 0, publi: 0, contratacion: 0, ventasComercial: 0 }, 1), [b]);
  const esc = useMemo(() => [
    { n: "Prudente", r: calc(b, 0.6) },
    { n: "Central", r: calc(b, 1) },
    { n: "Optimista", r: calc(b, 1.3) },
  ], [b]);
  const peso = [
    { h: "Elasticidad del precio", v: Math.abs(b.ventas * (b.precio / 100) * b.elasticidad) },
    { h: "Publicidad", v: b.publi * b.roas },
    { h: "Nueva contratación", v: b.ventasComercial + b.contratacion / 12 },
  ].sort((x, y) => y.v - x.v);

  const slider = (f: Field) => (
    <label key={f.k} className="block">
      <span className="flex justify-between gap-3 text-sm"><span className="min-w-0 text-lp-slate">{f.label}</span><strong className="shrink-0 text-lp-ink">{f.unit === "€" ? eur(b[f.k]) : `${b[f.k]}${f.unit ? " " + f.unit : ""}`}</strong></span>
      <input type="range" className="mt-2 w-full accent-[var(--lp-blue)]" min={f.min} max={f.max} step={f.step} value={b[f.k]} onChange={(e) => setB({ ...b, [f.k]: Number(e.target.value) })} />
    </label>
  );

  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-28 pb-20 sm:px-5 sm:pt-36">
      <Link to="/app" className="text-sm text-lp-blue">← Centro de análisis</Link>
      <h1 className="mt-3 text-3xl font-extrabold text-lp-ink sm:text-4xl">Simulador de decisiones</h1>
      <p className="mt-3 max-w-3xl text-lp-slate">Mueve los deslizadores para ver al instante cómo cambian tus ventas, tu margen, tu caja y tu punto de equilibrio. Siempre verás tres escenarios: nunca es una certeza.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="space-y-5 rounded-2xl border border-lp-line bg-lp-bg p-5">
          <h2 className="font-bold text-lp-ink">Tu situación</h2>
          {baseFields.map(slider)}
          <h2 className="pt-2 font-bold text-lp-ink">La decisión</h2>
          {decisionFields.map(slider)}
        </section>
        <section className="min-w-0 space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {esc.map(({ n, r }) => (
              <div key={n} className={`rounded-2xl border p-4 ${n === "Central" ? "border-lp-blue" : "border-lp-line"}`}>
                <p className="text-xs font-bold uppercase text-lp-muted">{n}</p>
                <p className="mt-2 text-sm text-lp-slate">Ventas/mes <strong className="block text-xl text-lp-ink">{eur(r.ventas)}</strong></p>
                <p className="mt-2 text-sm text-lp-slate">Margen bruto <strong className="block text-lp-ink">{eur(r.margenBruto)}</strong></p>
                <p className="mt-2 text-sm text-lp-slate">Caja/mes <strong className={`block ${r.caja < 0 ? "text-destructive" : "text-lp-ink"}`}>{eur(r.caja)}</strong></p>
                <p className="mt-2 text-sm text-lp-slate">Punto de equilibrio <strong className="block text-lp-ink">{Number.isFinite(r.equilibrio) ? eur(r.equilibrio) : "—"}</strong></p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-lp-line p-4 text-sm text-lp-slate">
            Hoy: ventas {eur(actual.ventas)}, caja {eur(actual.caja)}/mes. Escenario central: diferencia de caja <strong className="text-lp-ink">{eur(esc[1]!.r.caja - actual.caja)}</strong> al mes ({pct(actual.caja ? ((esc[1]!.r.caja - actual.caja) / Math.abs(actual.caja)) * 100 : 0)}).
          </div>
          <div className="rounded-2xl border border-lp-line p-4">
            <h3 className="font-bold text-lp-ink">Qué hipótesis pesan más</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-lp-slate">{peso.map((p) => <li key={p.h}>{p.h}: {eur(p.v)}/mes de efecto</li>)}</ol>
            <p className="mt-2 text-xs text-lp-muted">Fiabilidad: media. La elasticidad y el retorno de la publicidad son estimaciones; con tus datos de ventas reales los agentes los ajustan.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg bg-lp-blue px-4 py-2 text-sm font-semibold text-lp-on-dark" onClick={() => setSaved([...saved, { nombre: `Escenario ${saved.length + 1}`, b }])}>Guardar escenario</button>
            <button className="rounded-lg border border-lp-line px-4 py-2 text-sm" onClick={() => setVer(!ver)}>Ver cálculo</button>
          </div>
          {ver && <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-lp-line/40 p-4 text-xs text-lp-ink">{`volumen = 1 − elasticidad × cambio_precio (prudente ×1,3 · optimista ×0,7)
ventas = ventas_actuales × (1 + cambio_precio) × volumen + (publicidad × retorno + ventas_comercial) × factor
margen_unitario = (margen + cambio_precio) / (1 + cambio_precio)
costes = fijos + publicidad + contratación/12
caja = margen_bruto − costes · equilibrio = costes / margen_unitario
factor: prudente 0,6 · central 1 · optimista 1,3`}</pre>}
          {saved.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-lp-line">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead><tr className="text-lp-muted"><th className="p-3">Escenario</th><th>Precio</th><th>Publicidad</th><th>Ventas (central)</th><th>Caja (central)</th><th></th></tr></thead>
                <tbody>{saved.map((s, i) => { const r = calc(s.b, 1); return <tr key={i} className="border-t border-lp-line"><td className="p-3">{s.nombre}</td><td>{s.b.precio} %</td><td>{eur(s.b.publi)}</td><td>{eur(r.ventas)}</td><td>{eur(r.caja)}</td><td><button className="text-lp-blue" onClick={() => setB(s.b)}>Cargar</button></td></tr>; })}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
