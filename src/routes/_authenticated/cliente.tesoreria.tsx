import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pageHead } from "@/lib/meta";

export const Route = createFileRoute("/_authenticated/cliente/tesoreria")({
  head: () => pageHead("Previsión de tesorería a 13 semanas", "Sube tus movimientos y ve tu saldo previsto semana a semana, con días de riesgo, calidad de datos y recomendaciones."),
  component: Page,
});

type Mov = { fecha: Date; concepto: string; importe: number };
const eur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const WEEK = 7 * 864e5;

function parseNum(s: string) {
  const t = s.replace(/[€\s]/g, "");
  return Number(t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t);
}
function parseDate(s: string) {
  const m = s.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (m) return new Date(Number(m[3]!.length === 2 ? "20" + m[3] : m[3]), Number(m[2]) - 1, Number(m[1]));
  return new Date(s.trim());
}

function parse(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const sep = (lines[0] ?? "").includes(";") ? ";" : ",";
  const head = (lines[0] ?? "").toLowerCase().split(sep);
  const hasHead = head.some((h) => /fecha|date|importe|amount/.test(h));
  const iF = Math.max(0, head.findIndex((h) => /fecha|date/.test(h)));
  const iI = hasHead ? head.findIndex((h) => /importe|amount|cantidad|total/.test(h)) : 2;
  const iC = hasHead ? head.findIndex((h) => /concepto|descrip|concept/.test(h)) : 1;
  const rows: Mov[] = []; const issues = { vacios: 0, fechas: 0, numeros: 0, duplicados: 0, futuras: 0 };
  const seen = new Set<string>();
  for (const l of lines.slice(hasHead ? 1 : 0)) {
    const c = l.split(sep);
    const f = c[iF] ?? ""; const imp = c[iI < 0 ? 2 : iI] ?? ""; const con = (c[iC < 0 ? 1 : iC] ?? "").trim();
    if (!f.trim() || !imp.trim()) { issues.vacios++; continue; }
    const d = parseDate(f); const n = parseNum(imp);
    if (isNaN(d.getTime()) || d.getFullYear() < 1990) { issues.fechas++; continue; }
    if (!Number.isFinite(n)) { issues.numeros++; continue; }
    if (d.getTime() > Date.now() + 86400e3) issues.futuras++;
    const key = `${d.toDateString()}|${n}|${con}`;
    if (seen.has(key)) { issues.duplicados++; continue; }
    seen.add(key); rows.push({ fecha: d, concepto: con || "Sin concepto", importe: n });
  }
  const total = lines.length - (hasHead ? 1 : 0);
  const malos = issues.vacios + issues.fechas + issues.numeros + issues.duplicados + issues.futuras;
  const score = total ? Math.max(0, Math.round(100 - (malos / total) * 100)) : 0;
  return { rows: rows.sort((a, b) => +a.fecha - +b.fecha), issues, score, total };
}

const ejemplo = `fecha;concepto;importe
01/08/2026;Ventas tienda;8200
04/08/2026;Alquiler local;-2100
08/08/2026;Ventas tienda;7600
10/08/2026;Nóminas;-9800
15/08/2026;Ventas tienda;7900
20/08/2026;Proveedor materia prima;-4300
22/08/2026;Ventas tienda;6900
29/08/2026;Ventas tienda;7100
01/09/2026;Alquiler local;-2100
05/09/2026;Ventas tienda;7400
10/09/2026;Nóminas;-9800
12/09/2026;Ventas tienda;7000
18/09/2026;Proveedor materia prima;-4500
19/09/2026;Ventas tienda;6600
26/09/2026;Ventas tienda;6800
01/10/2026;Alquiler local;-2100`;

function Page() {
  const [text, setText] = useState(ejemplo);
  const [saldo, setSaldo] = useState(15000);
  const [minimo, setMinimo] = useState(5000);
  const [ver, setVer] = useState(false);
  const data = useMemo(() => parse(text), [text]);

  const prev = useMemo(() => {
    const r = data.rows; if (r.length < 2) return null;
    const start = +r[0]!.fecha; const end = +r[r.length - 1]!.fecha;
    const semanas = Math.max(1, (end - start) / WEEK);
    const entradas = r.filter((x) => x.importe > 0).reduce((s, x) => s + x.importe, 0) / semanas;
    const salidas = r.filter((x) => x.importe < 0).reduce((s, x) => s + x.importe, 0) / semanas;
    const semanal: number[] = [];
    for (let t = start; t <= end; t += WEEK) semanal.push(r.filter((x) => +x.fecha >= t && +x.fecha < t + WEEK).reduce((s, x) => s + x.importe, 0));
    const media = semanal.reduce((a, b) => a + b, 0) / semanal.length;
    const sd = Math.sqrt(semanal.reduce((a, b) => a + (b - media) ** 2, 0) / semanal.length);
    const n = semanal.length;
    const xs = semanal.map((_, i) => i); const mx = (n - 1) / 2;
    const tend = n > 1 ? xs.reduce((a, x, i) => a + (x - mx) * (semanal[i]! - media), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0) : 0;
    // gastos recurrentes: conceptos negativos repetidos
    const grupos = new Map<string, number[]>();
    r.filter((x) => x.importe < 0).forEach((x) => grupos.set(x.concepto, [...(grupos.get(x.concepto) ?? []), x.importe]));
    const recurrentes = [...grupos].filter(([, v]) => v.length >= 2).map(([c, v]) => ({ c, media: v.reduce((a, b) => a + b, 0) / v.length, sube: v[v.length - 1]! < v[0]! }));
    let c = saldo, p = saldo, o = saldo;
    const puntos = Array.from({ length: 13 }, (_, i) => {
      const flujo = media + tend * 0.5 * (i + 1);
      const banda = sd * Math.sqrt(i + 1) * 0.6;
      c += flujo; p += flujo - banda / Math.sqrt(i + 1); o += flujo + banda / Math.sqrt(i + 1);
      const fecha = new Date(Date.now() + (i + 1) * WEEK);
      return { semana: fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }), central: Math.round(c), prudente: Math.round(p), optimista: Math.round(o) };
    });
    const fiabilidad = Math.max(10, Math.min(90, Math.round(90 - (Math.abs(media) > 0 ? (sd / Math.abs(media)) * 20 : 40) - (n < 8 ? 25 : 0))));
    return { entradas, salidas, media, sd, tend, puntos, recurrentes, fiabilidad, n };
  }, [data, saldo]);

  const riesgo = prev?.puntos.find((p) => p.prudente < minimo);

  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-28 pb-20 sm:px-5 sm:pt-36">
      <Link to="/app" className="text-sm text-lp-blue">← Centro de análisis</Link>
      <h1 className="mt-3 text-3xl font-extrabold text-lp-ink sm:text-4xl">Previsión de tesorería a 13 semanas</h1>
      <p className="mt-3 max-w-3xl text-lp-slate">Sube el extracto del banco o una exportación de cobros y pagos (CSV con fecha, concepto e importe). Verás el saldo previsto semana a semana en tres escenarios y los días de riesgo. Tus datos se procesan solo en tu navegador.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="min-w-0 space-y-4 rounded-2xl border border-lp-line p-5">
          <label className="block text-sm font-semibold text-lp-ink">Subir CSV
            <input type="file" accept=".csv,.txt" className="mt-2 block w-full text-sm" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setText(await f.text()); }} />
          </label>
          <label className="block text-sm text-lp-slate">O pega los movimientos
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mt-2 w-full rounded-lg border border-lp-line bg-lp-bg p-2 font-mono text-xs" />
          </label>
          <label className="block text-sm text-lp-slate">Saldo actual en banco (€)
            <input type="number" value={saldo} onChange={(e) => setSaldo(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-lp-line bg-lp-bg p-2" />
          </label>
          <label className="block text-sm text-lp-slate">Umbral mínimo de caja (€)
            <input type="number" value={minimo} onChange={(e) => setMinimo(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-lp-line bg-lp-bg p-2" />
          </label>
          <div className="rounded-xl border border-lp-line p-3 text-sm">
            <p className="font-bold text-lp-ink">Calidad de los datos: {data.score}/100</p>
            <ul className="mt-1 text-xs text-lp-slate">
              <li>{data.total} filas · {data.rows.length} válidas</li>
              {data.issues.duplicados > 0 && <li>{data.issues.duplicados} duplicadas (descartadas)</li>}
              {data.issues.vacios > 0 && <li>{data.issues.vacios} con campos vacíos</li>}
              {data.issues.fechas > 0 && <li>{data.issues.fechas} con fecha imposible</li>}
              {data.issues.numeros > 0 && <li>{data.issues.numeros} con importe ilegible</li>}
              {data.issues.futuras > 0 && <li>{data.issues.futuras} con fecha futura</li>}
            </ul>
            {data.score < 70 && <p className="mt-2 text-xs text-destructive">Aviso: la previsión se basa en datos de baja calidad.</p>}
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          {!prev ? <p className="rounded-xl border border-lp-line p-5 text-lp-slate">Necesito al menos dos movimientos con fecha e importe.</p> : <>
            {riesgo
              ? <p role="alert" className="rounded-xl border border-destructive p-4 text-sm font-semibold text-destructive">La semana del {riesgo.semana}, el saldo previsto (escenario prudente) quedará por debajo de {eur(minimo)}: {eur(riesgo.prudente)}.</p>
              : <p className="rounded-xl border border-lp-line p-4 text-sm text-lp-slate">En las próximas 13 semanas el saldo no baja de {eur(minimo)} ni en el escenario prudente.</p>}
            <div className="h-[300px] rounded-2xl border border-lp-line p-2 sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prev.puntos} margin={{ left: 0, right: 8, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-line)" />
                  <XAxis dataKey="semana" fontSize={11} />
                  <YAxis fontSize={11} width={60} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v: number) => eur(v)} />
                  <ReferenceLine y={minimo} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Mínimo", fontSize: 11 }} />
                  <Area dataKey="optimista" stroke="var(--lp-blue)" fill="var(--lp-blue)" fillOpacity={0.08} />
                  <Area dataKey="central" stroke="var(--lp-blue)" strokeWidth={2} fillOpacity={0} />
                  <Area dataKey="prudente" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-lp-line p-3 text-sm text-lp-slate">Cobros/semana<strong className="block text-lg text-lp-ink">{eur(prev.entradas)}</strong></div>
              <div className="rounded-xl border border-lp-line p-3 text-sm text-lp-slate">Pagos/semana<strong className="block text-lg text-lp-ink">{eur(prev.salidas)}</strong></div>
              <div className="rounded-xl border border-lp-line p-3 text-sm text-lp-slate">Fiabilidad del modelo<strong className="block text-lg text-lp-ink">{prev.fiabilidad} %</strong></div>
            </div>
            <div className="rounded-2xl border border-lp-line p-4">
              <h2 className="font-bold text-lp-ink">Recomendaciones</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-lp-slate">
                {riesgo && <li>Adelanta cobros pendientes antes del {riesgo.semana} (descuento por pronto pago o recordatorio a clientes).</li>}
                {riesgo && <li>Aplaza pagos no urgentes de esa semana o negocia vencimientos con proveedores.</li>}
                {prev.tend < 0 && <li>Tu flujo semanal baja unos {eur(Math.abs(prev.tend))} cada semana: revisa ventas y gastos crecientes.</li>}
                {prev.recurrentes.map((g) => <li key={g.c}>Gasto recurrente «{g.c}»: {eur(Math.abs(g.media))} de media{g.sube ? " y ha subido; compara precios" : ""}.</li>)}
                {!riesgo && prev.tend >= 0 && <li>Situación estable: valora colocar el excedente o adelantar inversiones.</li>}
              </ul>
            </div>
            <button className="rounded-lg border border-lp-line px-4 py-2 text-sm" onClick={() => setVer(!ver)}>Ver cálculo</button>
            {ver && <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-lp-line/40 p-4 text-xs text-lp-ink">{`Semanas analizadas: ${prev.n}
Flujo semanal medio = Σ importes por semana / semanas = ${eur(prev.media)}
Desviación típica semanal = ${eur(prev.sd)} · Tendencia (regresión lineal) = ${eur(prev.tend)}/semana
Central_s = saldo + Σ (media + tendencia × 0,5 × s)
Prudente/Optimista = central ∓ 0,6 × desviación × √s (rango que se ensancha con el tiempo)`}</pre>}
          </>}
        </section>
      </div>
    </main>
  );
}
