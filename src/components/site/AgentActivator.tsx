import { useMemo, useState } from "react";
import { ArrowRight, Building2, Zap } from "lucide-react";
import { sectorAgents, sectorList } from "@/lib/sector-agents";
import { agents, type Agent } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

// Shared "activate the agent of any sector" block used by every section page.
// Sector choice is passed to the analysis centre so the report is framed for that activity.
export function AgentActivator({
  section,
  options,
  defaultAgent,
  sector: presetSector = "",
}: {
  section: string;
  options?: Agent[] | undefined;
  defaultAgent?: string | undefined;
  sector?: string | undefined;
}) {
  const pool = useMemo(
    () => (options && options.length > 0 ? options : agents.filter((a) => a.category !== "nucleo")),
    [options],
  );
  const preset = sectorList.find((s) => s.label.toLowerCase() === presetSector.toLowerCase());
  const [sector, setSector] = useState(preset?.slug ?? "otro");
  const [other, setOther] = useState(preset ? "" : presetSector);
  const [agent, setAgent] = useState(pool.some((a) => a.slug === defaultAgent) ? (defaultAgent as string) : pool[0]?.slug ?? "");

  const sectorLabel = sector === "otro" ? other.trim() : (sectorList.find((s) => s.slug === sector)?.label ?? "");
  const suggested = sector === "otro" ? [] : sectorAgents(sector).filter((a) => pool.some((p) => p.slug === a.slug));
  const active = pool.find((a) => a.slug === agent);
  const query = new URLSearchParams({ agente: agent });
  if (sectorLabel) query.set("sector", sectorLabel);

  return (
    <section id="activar" className="mt-12 rounded-2xl border border-lp-line bg-lp-bg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-lp-ink">Activa el agente de tu sector</h2>
      <p className="mt-3 max-w-3xl text-lp-slate">
        Elige tu sector y el agente de {section} que quieres poner a trabajar. Se activa al instante con la
        suscripción, sin formularios ni llamadas. Si tu actividad no aparece, escríbela: el enjambre se
        configura igual.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="text-sm font-semibold text-lp-ink">
          Sector
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="mt-2 w-full rounded-md border border-lp-line bg-lp-bg p-3 font-normal"
          >
            {sectorList.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
            <option value="otro">Otro sector (indícalo)</option>
          </select>
          {sector === "otro" && (
            <input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Ej. construcción, energía, educación…"
              className="mt-3 w-full rounded-md border border-lp-line bg-lp-bg p-3 font-normal"
            />
          )}
        </label>
        <label className="text-sm font-semibold text-lp-ink">
          Agente
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="mt-2 w-full rounded-md border border-lp-line bg-lp-bg p-3 font-normal"
          >
            {pool.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {suggested.length > 0 && (
        <p className="mt-4 text-sm text-lp-slate">
          También trabajan en este sector: {suggested.map((a) => a.name).join(", ")}.
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button asChild className="gap-2">
          <a href={`/app?${query.toString()}`}>
            <Zap className="h-4 w-4" />
            Activar {active ? active.name : "el agente"}
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/suscripciones">
            Ver planes y activar <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs text-lp-muted">
        <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        LUMINA DATA INSIGHTS · CIF B6847213 · Servicio 100 % en línea.
      </p>
    </section>
  );
}
