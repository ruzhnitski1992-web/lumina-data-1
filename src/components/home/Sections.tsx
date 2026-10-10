import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Store, Landmark, Shield, Factory, HeartPulse, Truck, Briefcase, Plug, Cpu, Users, TrendingUp, Check, ArrowRight, Lock, Scale, KeyRound, EyeOff, UserCheck, GitBranch, Minus, X as XIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { illustrativeCases, securityTopics } from "@/lib/content";
import { analytics, sectors, agents, agentCategories } from "@/lib/site-data";
import { useReducedMotion } from "./LazySphere";

export function SectorsStrip() {
  const s = [{ I: Store, l: "Retail" }, { I: Landmark, l: "Banca" }, { I: Shield, l: "Seguros" }, { I: Factory, l: "Industria" }, { I: HeartPulse, l: "Salud" }, { I: Truck, l: "Logística" }, { I: Briefcase, l: "Servicios Profesionales" }];
  return (
    <section id="sectores" aria-label="Sectores" className="border-y border-lp-line bg-lp-soft py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5 px-5 lg:flex-row lg:justify-between">
        <p className="shrink-0 text-sm font-semibold text-lp-muted">Diseñado para equipos directivos de</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {s.map(({ I, l }) => <li key={l} className="flex items-center gap-2 text-sm font-medium text-lp-slate"><I className="h-5 w-5" aria-hidden />{l}</li>)}
        </ul>
      </div>
    </section>
  );
}

function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setV(to); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);
  return <span ref={ref}>{prefix}{v.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export function StatsBand() {
  const stats = [
    { n: <Counter to={55} suffix=" %" />, t: "de los datos de una organización son oscuros: no se conocen o no se utilizan.", s: "Splunk, The State of Dark Data (2019), encuesta a más de 1.300 directivos." },
    { n: <><Counter to={1} /> de cada 3</>, t: "directivos afirma que más del 75 % de los datos de su empresa son oscuros.", s: "Splunk, The State of Dark Data (2019)." },
    { n: <Counter to={87} suffix=" %" />, t: "de las organizaciones encuestadas mostraban baja madurez en BI y analítica en 2018.", s: "Gartner, encuesta de madurez BI (2018). Dato histórico, no estimación de Lumina." },
    { n: <Counter to={41} suffix=" agentes" />, t: "perfiles especializados para revisar objetivos financieros, operativos, comerciales y de búsqueda.", s: "Catálogo propio: especializaciones, no 41 procesos simultáneos activos." },
  ];
  return (
    <section aria-labelledby="coste" className="bg-lp-navy py-20 text-lp-on-dark">
      <div className="mx-auto max-w-[1280px] px-5">
        <h2 id="coste" className="h2-fluid text-center font-extrabold uppercase">El coste de no ver tus datos</h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="border-l border-lp-blue/50 pl-6">
              <p className="text-5xl font-extrabold text-lp-blue-soft">{s.n}</p>
              <p className="mt-3 text-sm opacity-85">{s.t}</p>
              <p className="mt-3 text-xs opacity-50">Fuente: {s.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { I: Plug, t: "Conectamos tus fuentes", d: "Correos, PDFs, Excel, CRM, ERP, chats corporativos y repositorios documentales.", b: ["Conectores seguros", "Acceso de solo lectura", "Inventario automático de fuentes"] },
  { I: Cpu, t: "Procesamiento y ETL", d: "Extracción, limpieza y estructuración automáticas de toda la información.", b: ["OCR de documentos escaneados", "Anonimización de datos personales", "Normalización y deduplicación"] },
  { I: Users, t: "Análisis Agéntico", d: "El Arqueólogo descubre patrones, el Financiero los cuantifica y el Auditor los contrasta antes de validarlos.", b: ["Debate entre agentes", "Trazabilidad hasta el documento de origen", "Puntuación de confianza"] },
  { I: TrendingUp, t: "Soluciones de Impacto", d: "Informes ejecutivos listos para ejecutar en el comité de dirección.", b: ["Impacto estimado en euros", "Prioridad y responsable sugerido", "Plan de acción 30-60-90 días"] },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const [r, setR] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setR({ x: ((e.clientY - b.top) / b.height - 0.5) * -12, y: ((e.clientX - b.left) / b.width - 0.5) * 12 }); }}
      onMouseLeave={() => setR({ x: 0, y: 0 })} style={{ transform: `perspective(800px) rotateX(${r.x}deg) rotateY(${r.y}deg)` }}
      className="relative h-full rounded-2xl border border-lp-line bg-lp-bg p-6 shadow-lp transition-transform duration-150">{children}</div>
  );
}

export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const w = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <h2 className="h2-fluid text-center font-extrabold uppercase text-lp-ink">¿Cómo lo hacemos?</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-lp-muted">De datos dispersos a decisiones cuantificadas en cuatro fases, con supervisión humana en cada etapa.</p>
      <div ref={ref} className="relative mt-14">
        <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-lp-line lg:block" aria-hidden><motion.div style={{ width: w }} className="h-full bg-lp-blue" /></div>
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t}>
              <TiltCard>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-extrabold text-lp-blue [text-shadow:0_0_24px_color-mix(in_oklab,var(--lp-blue)_45%,transparent)]">{i + 1}</span>
                  <s.I className="h-8 w-8 text-lp-blue" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-bold text-lp-ink">{s.t}</h3>
                <p className="mt-2 text-sm text-lp-muted">{s.d}</p>
                <ul className="mt-4 space-y-1.5">{s.b.map((b) => <li key={b} className="flex gap-2 text-sm text-lp-slate"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lp-blue" />{b}</li>)}</ul>
              </TiltCard>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const debate = [
  { a: "Agente Arqueólogo", m: "He encontrado 214 correos de clientes con la palabra 'cancelar' en los últimos 90 días." },
  { a: "Agente Financiero", m: "Con el ticket medio, son unos 1.500 € al mes de ingresos en riesgo." },
  { a: "Agente Auditor", m: "Confirmado en 3 fuentes independientes. Confianza: 92 %." },
  { a: "Agente Estratega", m: "Recomendación: flujo de retención proactivo para las 38 cuentas de mayor valor." },
];

export function AgentDebate() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setLine(debate.length); return; }
    if (line >= debate.length) return;
    const full = debate[line]?.m.length ?? 0;
    const t = setTimeout(() => { if (chars < full) setChars(chars + 2); else { setLine(line + 1); setChars(0); } }, chars < full ? 22 : 700);
    return () => clearTimeout(t);
  }, [inView, line, chars, reduced]);
  return (
    <section aria-labelledby="debate" className="py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="debate" className="h2-fluid font-extrabold text-lp-ink">Los agentes debaten. Tú decides.</h2>
          <p className="mt-5 text-lg text-lp-muted">Cada hallazgo pasa por varios agentes antes de llegar a ti: uno lo descubre, otro lo cuantifica en euros, otro lo contrasta y otro propone la acción. Siempre con supervisión humana.</p>
        </div>
        <div ref={ref} className="rounded-2xl bg-lp-navy p-6 font-mono text-sm text-lp-on-dark shadow-lp lg:col-span-7" aria-live="polite">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className="h-3 w-3 rounded-full bg-lp-on-dark/20" />)}</div>
            <span className="rounded-full border border-lp-on-dark/20 px-2.5 py-0.5 text-[11px]">Simulación ilustrativa</span>
          </div>
          <div className="min-h-[260px] space-y-4">
            {debate.slice(0, line + 1).map((d, i) => i < debate.length && (
              <div key={d.a}>
                <p className="text-xs font-bold text-lp-blue-soft">{d.a}</p>
                <p className="mt-1 opacity-90">{i < line ? d.m : d.m.slice(0, chars)}{i === line && <span className="animate-pulse">▍</span>}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgentsPreview() {
  const [cat, setCat] = useState<string>("nucleo");
  return (
    <section aria-labelledby="enjambre" className="bg-lp-soft py-24">
      <div className="mx-auto max-w-[1280px] px-5">
        <h2 id="enjambre" className="h2-fluid max-w-4xl font-extrabold text-lp-ink">Más de 40 agentes de IA especializados. Un único objetivo: tu cuenta de resultados.</h2>
        <div role="tablist" aria-label="Categorías de agentes" className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {agentCategories.map((c) => (
            <Button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c.id ? "border-lp-blue bg-lp-blue text-lp-on-dark" : "border-lp-line bg-lp-bg text-lp-slate hover:border-lp-blue"}`}>{c.name}</Button>
          ))}
        </div>
        <div role="tabpanel" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.filter((x) => x.category === cat).map((ag) => (
            <a key={ag.slug} href={`/agentes/${ag.slug}`} className="group rounded-2xl border border-lp-line bg-lp-bg p-6 transition hover:-translate-y-1 hover:border-lp-blue hover:shadow-lp">
              <ag.icon className="h-8 w-8 text-lp-blue" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-lp-ink">{ag.name}</h3>
              <p className="mt-2 text-sm text-lp-muted">{ag.mission}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-lp-slate">Entregable: <span className="text-lp-blue">{ag.deliverable}</span></p>
            </a>
          ))}
        </div>
        <a href="/agentes" className="mt-10 inline-flex items-center gap-2 font-semibold text-lp-blue hover:underline">Ver todos los agentes <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  );
}

const stairs = [
  { t: "Descriptiva", q: "¿Qué ha pasado?", k: "Estadística, OLAP y KPIs (Power BI / Tableau)", e: "Ventas por canal del último trimestre." },
  { t: "Diagnóstica", q: "¿Por qué ha pasado?", k: "Análisis de causa raíz", e: "Por qué cayó el margen en una región." },
  { t: "Predictiva", q: "¿Qué va a pasar?", k: "Series temporales, backtesting y clasificación", e: "Qué clientes cancelarán el próximo mes." },
  { t: "Prescriptiva", q: "¿Qué debemos hacer?", k: "Optimización con restricciones y sensibilidad", e: "Qué precio fijar por segmento." },
  { t: "Cognitiva", q: "¿Qué dicen nuestros textos, correos y conversaciones?", k: "NLP y análisis de sentimiento", e: "Quejas recurrentes en tickets de soporte." },
];

export function MaturityStairs() {
  return (
    <section aria-labelledby="madurez" className="py-24">
      <div className="mx-auto max-w-[1280px] px-5">
        <h2 id="madurez" className="h2-fluid font-extrabold text-lp-ink">La escalera de madurez analítica</h2>
        <p className="mt-4 max-w-2xl text-lg text-lp-muted">Cada peldaño responde a una pregunta de negocio más valiosa. Las seis modalidades se combinan según el dato y la decisión. Validar un baseline, controlar sesgos y medir incertidumbre es tan importante como elegir un modelo.</p>
        <ol className="mt-14 grid items-end gap-4 [perspective:1200px] md:grid-cols-3">
          {stairs.map((s, i) => (
            <motion.li key={s.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-lp-line bg-lp-bg p-5 shadow-lp md:[transform:rotateX(8deg)]" style={{ minHeight: 260 }}>
              <div className="md:h-[var(--h)]" style={{ ["--h" as string]: `${140 + i * 50}px` }}>
                <span className="text-xs font-bold text-lp-blue">Nivel {i + 1}</span>
                <h3 className="mt-1 text-lg font-bold text-lp-ink"><a href={`/analitica/${["descriptiva","diagnostica","predictiva","prescriptiva","cognitiva"][i]}`}>{s.t} →</a></h3>
                <p className="mt-1 text-sm font-medium text-lp-slate">{s.q}</p>
                <p className="mt-3 text-xs text-lp-muted"><strong className="text-lp-slate">Técnica:</strong> {s.k}</p>
                <p className="mt-1 text-xs text-lp-muted"><strong className="text-lp-slate">Ejemplo:</strong> {s.e}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-lp-muted">Referencias de práctica, no clientes: Microsoft Power BI, Tableau y NIST AI RMF. El análisis en tiempo real requiere fuentes de eventos conectadas.</p><a href="/analitica" className="mt-10 inline-flex items-center gap-2 font-semibold text-lp-blue hover:underline">Explorar la analítica <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  );
}

export function Cases(){ return <section className="bg-lp-alt py-24"><div className="mx-auto max-w-[1280px] px-5"><h2 className="h2-fluid font-extrabold">Casos de aplicación empresarial</h2><p className="mt-4 text-lp-muted">Escenarios ficticios y transparentes. No son clientes ni resultados verificados.</p><div className="mt-10 grid gap-6 md:grid-cols-3">{illustrativeCases.map(c=><a href={`/casos-de-exito#${c.id}`} key={c.id} className="rounded-lg border border-lp-line bg-lp-bg p-6"><span className="text-xs font-semibold text-lp-blue">Caso ilustrativo</span><h3 className="mt-4 text-xl font-bold">{c.title}</h3><p className="mt-3 text-sm text-lp-muted">{c.challenge}</p><p className="mt-5 text-xl font-bold text-lp-ok">{c.result}</p><p className="mt-2 text-xs text-lp-muted">{c.limit}</p></a>)}</div></div></section>; }

export function Security(){ return <section className="bg-lp-soft py-24"><div className="mx-auto max-w-[1280px] px-5"><h2 className="h2-fluid font-extrabold">Seguridad, privacidad y gobierno de la IA</h2><p className="mt-4 max-w-3xl text-lp-muted">Controles, responsabilidades y límites con referencias oficiales. No afirmamos certificaciones no verificadas.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{securityTopics.map(t=><a href={`/seguridad/${t.slug}`} key={t.slug} className="rounded-lg border border-lp-line bg-lp-bg p-6"><Shield className="h-7 w-7 text-lp-blue"/><h3 className="mt-4 font-bold">{t.title}</h3><p className="mt-3 text-sm text-lp-muted">{t.text.split('. ')[0]}.</p><p className="mt-4 text-sm font-semibold text-lp-blue">Leer información y fuentes →</p></a>)}</div></div></section>; }

type Cell = "yes" | "no" | "partial" | string;
const rows: { r: string; c: [Cell, Cell, Cell] }[] = [
 {r:"Fuentes y análisis",c:["Documentos y preguntas de negocio","Datos modelados y conectores; admite texto con extensiones","Alcance definido en cada proyecto"]},
 {r:"Primer diagnóstico",c:["3 días con datos suficientes","Depende de modelo, fuentes y equipo","Depende de alcance y disponibilidad"]},
 {r:"Evidencia y revisión",c:["Citas e incertidumbre en el informe","Linaje y controles según configuración","Documentación según metodología"]},
 {r:"Automatización",c:["Análisis al enviar un archivo autorizado","Actualizaciones y alertas configurables","Puede incluir automatización e IA"]},
 {r:"Impacto económico",c:["Estimación con supuestos, no ahorro garantizado","Métricas financieras configurables","Evaluación financiera según alcance"]},
 {r:"Precio y contratación",c:["Planes mensual, trimestral y anual","Licencias, capacidad e implantación","Honorarios por proyecto o servicio"]},
];
function C({ v }: { v: Cell }) {
  if (v === "yes") return <Check className="mx-auto h-5 w-5 text-lp-ok" aria-label="Sí" />;
  if (v === "no") return <XIcon className="mx-auto h-5 w-5 text-lp-alert" aria-label="No" />;
  if (v === "partial") return <Minus className="mx-auto h-5 w-5 text-lp-muted" aria-label="Parcial" />;
  return <span>{v}</span>;
}
export function Comparison() {
  return (
    <section aria-labelledby="comparativa" className="py-24">
      <div className="mx-auto max-w-[1280px] px-5">
        <h2 id="comparativa" className="h2-fluid font-extrabold text-lp-ink">Lumina frente a los enfoques tradicionales</h2>
        <p className="mt-4 max-w-3xl text-lp-muted">Comparación de enfoques, no benchmark de rendimiento. El BI moderno y la consultoría también incorporan IA: la diferencia está en el alcance y la implantación.</p><div className="mt-10 overflow-x-auto rounded-lg border border-lp-line">
          <table className="w-full min-w-[640px] text-center text-sm">
            <thead className="bg-lp-soft"><tr><th className="p-4 text-left font-semibold text-lp-slate">Criterio</th><th className="p-4 font-bold text-lp-blue">Lumina</th><th className="p-4 font-semibold text-lp-slate">BI tradicional</th><th className="p-4 font-semibold text-lp-slate">Consultoría tradicional</th></tr></thead>
            <tbody>{rows.map((x) => <tr key={x.r} className="border-t border-lp-line"><th scope="row" className="p-4 text-left font-medium text-lp-ink">{x.r}</th>{x.c.map((v, i) => <td key={i} className={`p-4 text-lp-slate ${i === 0 ? "bg-lp-alt font-semibold" : ""}`}><C v={v} /></td>)}</tr>)}</tbody>
          </table>
        </div><p className="mt-4 text-sm text-lp-muted">Referencias: <a className="text-lp-blue underline" href="https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing">Microsoft Power BI</a> · <a className="text-lp-blue underline" href="https://www.tableau.com/pricing">Tableau</a>. Las tarifas y prestaciones dependen de región, impuestos y plan.</p>
      </div>
    </section>
  );
}

export const faqs = [
  { q: "¿Qué son los datos oscuros?", a: "Son los datos que una empresa genera y almacena pero no analiza: correos, chats, contratos, PDFs, tickets o hojas de cálculo olvidadas. Contienen señales valiosas sobre clientes, costes y riesgos." },
  { q: "¿Qué es un agente de IA?", a: "Es un programa de inteligencia artificial con una misión concreta que analiza información, razona y propone acciones de forma autónoma, siempre bajo supervisión humana." },
  { q: "¿Qué archivos podéis analizar?", a: "Correos, chats corporativos, PDFs, documentos de Word, hojas de Excel, exportaciones de CRM y ERP, tickets de soporte y documentos escaneados mediante OCR." },
  { q: "¿Cómo protegéis la confidencialidad y cumplís el RGPD?", a: "Accedemos en modo de solo lectura, anonimizamos los datos personales, ciframos la información en tránsito y en reposo y aplicamos el principio de minimización." },
  { q: "¿Cuánto dura el diagnóstico gratuito?", a: "El diagnóstico se plantea en 3 días desde recibir información suficiente y autorizada. La prueba gratuita es una sola vez por cuenta; después se contrata un plan mensual, trimestral o anual." },
  { q: "¿Necesito un equipo técnico?", a: "No. Nos encargamos de la conexión de fuentes y del procesamiento. Solo necesitamos un interlocutor de negocio y los permisos de acceso." },
  { q: "¿En qué se diferencia de un BI tradicional?", a: "Un BI muestra datos estructurados que ya conoces. Nuestros agentes leen también los no estructurados, descubren lo que no sabías buscar y lo cuantifican en euros." },
  { q: "¿Trabajáis con empresas de mi sector y de mi ciudad?", a: "Trabajamos con equipos directivos de retail, banca, seguros, industria, salud, logística y servicios profesionales. Consúltanos tu caso concreto." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq" className="bg-lp-soft py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 id="faq" className="h2-fluid text-center font-extrabold text-lp-ink">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-lp-line rounded-2xl border border-lp-line bg-lp-bg">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <h3>
                <Button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-lp-ink">
                  {f.q}<Plus className={`h-5 w-5 shrink-0 text-lp-blue transition-transform ${open === i ? "rotate-45" : ""}`} />
                </Button>
              </h3>
              <div id={`faq-${i}`} hidden={open !== i} className="px-5 pb-5 text-lp-muted">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
