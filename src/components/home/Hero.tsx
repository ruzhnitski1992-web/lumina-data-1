import { AlertTriangle, TrendingUp, Clock, Plug, ShieldCheck, FileText, Mail, MessageSquare, FileSpreadsheet, Folder, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { LazySphere } from "./LazySphere";
import { UrlAudit } from "./UrlAudit";
import { agents } from "@/lib/site-data";

const docs = [
  { I: Folder, c: "left-[2%] top-[18%]" },
  { I: FileText, c: "left-[10%] top-[40%]", t: "PDF" },
  { I: Mail, c: "left-[1%] top-[58%]" },
  { I: MessageSquare, c: "left-[12%] top-[74%]" },
  { I: FileSpreadsheet, c: "left-[20%] top-[24%]" },
];
const labels = [
  { t: "Agente Arqueólogo", c: "left-[30%] top-[16%]" },
  { t: "Agente Financiero", c: "right-[18%] top-[30%]" },
  { t: "Agente Auditor", c: "left-[30%] bottom-[30%]" },
  { t: "Agente Estratega", c: "right-[22%] bottom-[22%]" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24">
      <div className="tech-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <span className="inline-flex rounded-full border border-lp-line bg-lp-bg px-3 py-1 text-xs font-semibold text-lp-blue shadow-sm">
            Plataforma de Agentes IA para Empresas · Dark Data Analytics
          </span>
          <h1 className="h1-fluid mt-6 font-extrabold uppercase text-lp-ink">
            Agentes de IA para empresas. Datos que se convierten en <span className="text-lp-blue">rentabilidad</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-lp-slate">
            Un enjambre de agentes de inteligencia artificial autónomos que analiza tus correos, chats y documentos olvidados para detectar pérdidas financieras y oportunidades sin que muevas un dedo.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-lp-blue/10 px-4 py-2 text-sm font-bold text-lp-blue">🎁 3 días de prueba gratis en todos los planes · cancela cuando quieras</p>
          <div className="mt-5 flex flex-wrap items-start gap-4">
            <div className="flex flex-col items-center">
              <a href="/suscripciones" className="rounded-lg bg-lp-blue px-7 py-4 font-semibold text-lp-on-dark shadow-glow transition hover:-translate-y-0.5">Empieza tus 3 días gratis</a>
              <span className="mt-2 text-xs text-lp-muted">No se cobra nada hasta el 4.º día</span>
            </div>
            <a href="#diagnostico" className="rounded-lg border border-lp-line bg-lp-bg px-7 py-4 font-semibold text-lp-ink transition hover:border-lp-blue hover:text-lp-blue">Sube un archivo</a>
          </div>
          <UrlAudit />
          <ul className="mt-8 grid gap-3 text-sm text-lp-slate sm:grid-cols-3">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-lp-blue" />Diagnóstico en 3 días</li>
            <li className="flex items-center gap-2"><Plug className="h-4 w-4 shrink-0 text-lp-blue" />Sin integración técnica compleja</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-lp-blue" />Datos tratados conforme al RGPD</li>
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          
          <div className="relative aspect-square w-full">
            <div className="absolute inset-[8%]"><LazySphere /></div>
            <nav aria-label="Los 40 agentes IA" className="absolute inset-[6%] z-10">
              {agents.map((ag, i) => {
                const ang = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 ? 46 : 38;
                return (
                  <Link key={ag.slug} to="/agentes/$slug" params={{ slug: ag.slug }} title={ag.name} aria-label={ag.name}
                    className="group absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lp-bg bg-lp-blue shadow-glow transition hover:scale-150 focus-visible:scale-150"
                    style={{ left: `${50 + Math.cos(ang) * r}%`, top: `${50 + Math.sin(ang) * r}%` }}>
                    <span className="pointer-events-none absolute left-1/2 top-5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-lp-ink px-2 py-1 text-[11px] font-semibold text-lp-on-dark group-hover:block group-focus-visible:block">{ag.name}</span>
                  </Link>
                );
              })}
            </nav>
            {docs.map(({ I, c, t }, i) => (
              <div key={i} className={`absolute ${c} grid h-11 w-11 place-items-center rounded-lg border border-lp-line bg-lp-bg/70 text-lp-slate/70 shadow-sm backdrop-blur animate-pulse`} style={{ animationDuration: `${3 + i}s` }} aria-hidden>
                <I className="h-5 w-5" />
                {t && <span className="absolute -bottom-1 -right-1 rounded bg-lp-alert px-1 text-[9px] font-bold text-lp-on-dark">{t}</span>}
              </div>
            ))}
            <span className="absolute left-[2%] top-[8%] text-xs font-semibold text-lp-muted">Datos Oscuros</span>
            {labels.map((l) => (
              <span key={l.t} className={`absolute ${l.c} hidden rounded-full border border-lp-blue/30 bg-lp-bg/90 px-2.5 py-1 text-[11px] font-semibold text-lp-blue shadow-sm sm:inline-block`}>{l.t}</span>
            ))}
            <svg viewBox="0 0 120 70" className="absolute right-0 top-[4%] w-[26%]" aria-label="Gráfico financiero ascendente">
              <rect x="0" y="0" width="120" height="70" rx="8" fill="var(--lp-bg)" stroke="var(--lp-line)" />
              <polyline points="10,58 30,50 48,54 66,36 84,30 108,12" fill="none" stroke="var(--lp-blue)" strokeWidth="3" strokeLinecap="round" />
              <polyline points="10,62 30,58 48,60 66,48 84,44 108,30" fill="none" stroke="var(--lp-ok)" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="glass-dark absolute bottom-[4%] right-0 w-[min(300px,85%)] rounded-xl border-l-4 !border-l-lp-alert p-4 text-lp-on-dark shadow-lp">
              <span className="absolute -left-1 top-4 h-3 w-3 animate-ping rounded-full bg-lp-alert" aria-hidden />
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold text-lp-alert"><AlertTriangle className="h-4 w-4" />¡PÉRDIDA DETECTADA!</p>
                <span title="Ejemplo ilustrativo" aria-label="Ejemplo ilustrativo"><Info className="h-4 w-4 opacity-60" /></span>
              </div>
              <p className="mt-1 text-sm">1.500 €/mes por cancelaciones de producto</p>
              <p className="mt-2 text-[11px] opacity-60">Detectado por el Agente Financiero · hace 2 min</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
              className="absolute left-0 top-[86%] w-[min(260px,75%)] rounded-xl border border-lp-ok/30 bg-lp-bg p-3 shadow-lp sm:top-auto sm:bottom-[26%]">
              <p className="flex items-center gap-2 text-xs font-bold text-lp-ok"><TrendingUp className="h-4 w-4" />Oportunidad identificada</p>
              <p className="mt-1 text-xs text-lp-ink">+4.200 €/mes en ventas cruzadas</p>
              <p className="mt-1 text-[10px] text-lp-muted">Ejemplo ilustrativo</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
