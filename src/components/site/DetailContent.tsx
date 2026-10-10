import { agents, agentCategories, solutionAreas, analytics, sectors } from "@/lib/site-data";
import { details, analyticDetails, securityTopics, illustrativeCases } from "@/lib/content";
import about from "@/assets/lumina-about.jpg.asset.json";
import workshop from "@/assets/lumina-workshop.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { analyticsGuide } from "@/lib/analytics-guide";
import { AgentActivator } from "@/components/site/AgentActivator";
import { sectorAgents, sectorProfile } from "@/lib/sector-agents";

export function DetailContent({
  title,
  intro,
  path,
}: {
  title: string;
  intro: string;
  path: string;
}) {
  const slug = path.split("/").filter(Boolean).at(-1) ?? "";
  const agent = path.startsWith("/agentes/") ? agents.find((a) => a.slug === slug) : undefined;
  const detail =
    details[slug] ??
    (agent
      ? details[
          agent.category === "nucleo"
            ? "datos-oscuros"
            : agent.category === "riesgo"
              ? "riesgo-legal"
              : agent.category
        ]
      : undefined);
  const analytic = analyticDetails[slug];
  const guide = analyticsGuide[slug];
  const isAbout = path === "/empresa/sobre-nosotros";
  const related = agent
    ? agents.filter((a) => a.category === agent.category && a.slug !== agent.slug)
    : detail
      ? agents.filter((a) => a.category === detail.category)
      : [];
  const guideAgents = guide
    ? guide.agents.map((s) => agents.find((a) => a.slug === s)).filter((a): a is NonNullable<typeof a> => a !== undefined)
    : [];
  const isSector = path.startsWith("/sectores/");
  return (
    <main className="pt-36 pb-24">
      <div className="mx-auto max-w-[1180px] px-5">
        <nav className="text-sm text-lp-muted" aria-label="Migas de pan">
          <a href="/">Inicio</a> / <span>{title}</span>
        </nav>
        <h1 className="h2-fluid mt-6 max-w-4xl font-extrabold text-lp-ink">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg text-lp-slate">{detail?.summary ?? intro}</p>
        {isAbout && (
          <>
            <img
              src={about.url}
              alt="Profesionales junto a un edificio corporativo"
              className="mt-10 aspect-[16/7] w-full object-cover"
            />
            <p className="mt-2 text-xs text-lp-muted">
              Imagen de presentación proporcionada; no identifica por sí sola al equipo de Lumina.
            </p>
            <div className="prose-lumina max-w-3xl">
              <h2>Inteligencia aplicada a decisiones de negocio</h2>
              <p>
                LUMINA DATA INSIGHTS orienta su propuesta al análisis de información empresarial
                infrautilizada. Nuestra prioridad es convertir documentos y señales operativas en
                preguntas medibles, evidencia revisable y acciones que un responsable pueda evaluar.
              </p>
              <h2>Cómo trabajamos</h2>
              <p>
                Delimitamos un objetivo, revisamos la disponibilidad y la autorización de los datos,
                analizamos las fuentes y documentamos los límites. El diagnóstico se plantea en 3
                días desde la recepción de información suficiente y autorizada. Los agentes apoyan
                el trabajo: no sustituyen el criterio financiero, jurídico o de gestión.
              </p>
              <h2>Compromiso con la transparencia</h2>
              <p>
                No presentamos escenarios ficticios como clientes reales, ni una recomendación como
                ahorro obtenido. La calidad de la información, la confidencialidad y la revisión
                humana determinan el alcance de cada proyecto.
              </p>
            </div>
          </>
        )}
        {detail && (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
            <div className="prose-lumina">
              <h2>El reto de negocio</h2>
              <p>{detail.challenge}</p>
              <h2>Proceso y metodología</h2>
              <p>{detail.methods}</p>
              <h2>Indicadores y validación</h2>
              <p>{detail.metrics}</p>
              <h2>La solución que entregamos</h2>
              <p>
                {agent
                  ? `${agent.name}: ${agent.mission} Entregable principal: ${agent.deliverable}. `
                  : ""}
                {detail.outcome}
              </p>
              <h2>Del hallazgo a la decisión</h2>
              <p>
                Primero se confirma el alcance y la calidad de la fuente. Después se distingue lo
                observado de lo inferido y se revisa una muestra de evidencias. La entrega reúne
                prioridades, datos pendientes, responsables sugeridos y un plan 30-60-90 días. Las
                integraciones, monitorización continua y ejecución de acciones requieren
                configuración específica y aprobación.
              </p>
              <p className="text-sm">
                <a
                  className="text-lp-blue underline"
                  href={detail.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Referencia: {detail.sourceName}
                </a>
              </p>
            </div>
            <aside className="border-l border-lp-line pl-6">
              <h2 className="text-lg font-bold">Agentes responsables</h2>
              <ul className="mt-5 space-y-5">
                {related.map((a) => (
                  <li key={a.slug}>
                    <a href={`/agentes/${a.slug}`} className="font-semibold text-lp-blue">
                      {a.name}
                    </a>
                    <p className="mt-1 text-sm text-lp-muted">{a.deliverable}</p>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8">
                <a href={`/app?agente=${agent?.slug ?? related[0]?.slug ?? "arqueologo"}`}>
                  Analizar con este agente
                </a>
              </Button>
              <p className="mt-3 text-xs text-lp-muted">
                Prueba gratuita una vez por cuenta. Después, suscripción.
              </p>
            </aside>
          </div>
        )}
        {path.startsWith("/soluciones/") && (
          <AgentActivator
            section={title.toLowerCase()}
            options={related.length > 0 ? related : agents.filter((a) => a.category === detail?.category)}
            defaultAgent={(related[0] ?? agents.find((a) => a.category === detail?.category))?.slug}
          />
        )}
        {analytic && (
          <div className="prose-lumina max-w-3xl">
            <h2>Técnicas y alcance</h2>
            <p>{analytic.technique}</p>
            <h2>Datos necesarios</h2>
            <p>{analytic.requirements}</p>
            <h2>Validación profesional</h2>
            <p>{analytic.validation}</p>
            <h2>Aplicación empresarial</h2>
            <p>{analytic.example}</p>
            <h2>Entregable</h2>
            <p>
              Informe con fuentes, parámetros, resultados, incertidumbre y recomendaciones. La
              calidad del dato y la validación con información real determinan qué conclusiones se
              pueden defender.
            </p>
            <a
              className="text-lp-blue underline"
              href="https://www.nist.gov/itl/ai-risk-management-framework"
            >
              Marco de referencia: NIST AI RMF
            </a>
          </div>
        )}
        {guide && <section className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]"><div className="prose-lumina"><h2>La decisión que resuelve</h2><p>{guide.decision}</p><h2>Solución paso a paso</h2><ol className="mt-5 list-decimal space-y-4 pl-6">{guide.workflow.map(step => <li key={step}>{step}</li>)}</ol><h2>Medición y límites</h2><p>{guide.measures}</p><h2>Mercado y contexto mundial</h2><p>Compara tus resultados con indicadores oficiales de actividad, inflación y empleo, manteniendo el mismo periodo y país. Las noticias aportan contexto, no sustituyen tus datos ni prueban causalidad.</p><div className="mt-5 flex flex-wrap gap-6"><a href="/noticias" className="text-lp-blue underline">Últimas noticias por área</a><a href="/datos-mundiales" className="text-lp-blue underline">Datos del Banco Mundial</a><a href={guide.source} target="_blank" rel="noreferrer" className="text-lp-blue underline">{guide.sourceName}</a></div></div><aside className="border-l border-lp-line pl-6"><h2 className="text-lg font-bold">Agentes responsables</h2><ul className="mt-5 space-y-6">{guide.agents.map(slug => agents.find(agent => agent.slug === slug)).filter(agent => agent !== undefined).map(agent => <li key={agent.slug}><a href={`/agentes/${agent.slug}`} className="font-semibold text-lp-blue">{agent.name}</a><p className="mt-2 text-sm text-lp-muted">{agent.mission}</p><p className="mt-2 text-xs text-lp-slate">{agent.deliverable}</p></li>)}</ul><Button asChild className="mt-8"><a href="/app">Analizar mis datos</a></Button></aside></section>}
        {guide && <AgentActivator section={title.toLowerCase()} options={guideAgents} defaultAgent={guideAgents[0]?.slug} />}
        {path === "/agentes" && (
          <>
            <h2 className="mt-12 text-2xl font-bold">Especialización y soluciones</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {agentCategories.map((c) => (
                <Button asChild variant="outline" key={c.id}>
                  <a href={`/agentes/categoria/${c.id}`}>{c.name}</a>
                </Button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a) => (
                <a
                  href={`/agentes/${a.slug}`}
                  key={a.slug}
                  className="rounded-lg border border-lp-line p-5"
                >
                  <a.icon className="h-7 w-7 text-lp-blue" />
                  <h3 className="mt-3 font-bold">{a.name}</h3>
                  <p className="mt-2 text-sm text-lp-muted">{a.mission}</p>
                  <p className="mt-3 text-sm text-lp-blue">{a.deliverable} →</p>
                </a>
              ))}
            </div>
          </>
        )}
        {path === "/analitica" && (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {analytics
                .filter((a) => a.href !== "/analitica")
                .map((a) => (
                  <a key={a.href} href={a.href} className="rounded-lg border border-lp-line p-6">
                    <h2 className="text-xl font-bold">{a.label}</h2>
                    <p className="mt-2 text-lp-blue">{a.desc}</p>
                    <p className="mt-3 text-sm text-lp-muted">
                      {analyticDetails[a.href.split("/").at(-1) ?? ""]?.technique}
                    </p>
                  </a>
                ))}
            </div>
            <div className="prose-lumina">
              <h2>Referencias corporativas, no clientes de Lumina</h2>
              <p>
                Power BI de Microsoft documenta modelado y visualización; Tableau documenta
                exploración visual; NIST aporta un marco de evaluación del riesgo de IA. Estas
                referencias describen prácticas del mercado y no avales ni resultados de Lumina.
              </p>
              <a
                href="https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview"
                className="text-lp-blue underline"
              >
                Microsoft Power BI
              </a>{" "}
              ·{" "}
              <a
                href="https://www.tableau.com/learn/articles/business-intelligence"
                className="text-lp-blue underline"
              >
                Tableau · Business Intelligence
              </a>
              <h2>Catálogo profesional de técnicas</h2><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b border-lp-line"><th className="py-3 pr-4">Nivel</th><th className="py-3 pr-4">Métodos</th><th className="py-3">Control imprescindible</th></tr></thead><tbody>{Object.entries(analyticDetails).map(([slug,item]) => <tr key={slug} className="border-b border-lp-line"><td className="py-4 pr-4"><a href={`/analitica/${slug}`} className="font-semibold text-lp-blue">{analytics.find(entry => entry.href === `/analitica/${slug}`)?.label}</a></td><td className="py-4 pr-4">{item.technique}</td><td className="py-4 text-lp-muted">{item.validation}</td></tr>)}</tbody></table></div><h2>Datos y novedades para interpretar tus resultados</h2><p>La evolución del PIB, los precios, el empleo y las cadenas de suministro puede afectar a la demanda, los costes y la liquidez. Separa siempre el indicador macroeconómico de las cifras de tu empresa y consulta la fecha real del dato.</p><div className="mt-5 flex flex-wrap gap-5"><a href="/noticias" className="text-lp-blue underline">Noticias de analítica mundial</a><a href="/datos-mundiales" className="text-lp-blue underline">Indicadores oficiales comparables</a><a href="/observatorio-ia" className="text-lp-blue underline">Investigación reciente en IA</a></div>
            </div>
          </>
        )}
        {path === "/casos-de-exito" && (
          <div className="mt-10 space-y-10">
            {illustrativeCases.map((c) => (
              <article id={c.id} key={c.id} className="border-b border-lp-line pb-10">
                <p className="text-sm font-semibold text-lp-blue">Caso ficticio e ilustrativo</p>
                <h2 className="mt-3 text-2xl font-bold">{c.title}</h2>
                <p className="mt-4">{c.challenge}</p>
                <p className="mt-3 text-lp-slate">{c.process}</p>
                <p className="mt-5 text-2xl font-bold text-lp-ok">{c.result}</p>
                <p className="mt-2 text-sm text-lp-muted">{c.limit}</p>
              </article>
            ))}
          </div>
        )}
        {path === "/seguridad" && (
          <>
            <div className="prose-lumina max-w-3xl">
              <h2>Qué es el Centro de Seguridad</h2>
              <p>
                Un punto de consulta sobre controles, responsabilidades y límites del tratamiento de
                datos y de la inteligencia artificial. Las fuentes oficiales definen obligaciones y
                buenas prácticas; no acreditan por sí mismas el cumplimiento de una empresa.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {securityTopics.map((t) => (
                <a
                  key={t.slug}
                  href={`/seguridad/${t.slug}`}
                  className="rounded-lg border border-lp-line p-6"
                >
                  <h2 className="text-xl font-bold">{t.title}</h2>
                  <p className="mt-3 text-sm text-lp-muted">{t.text.split(". ")[0]}.</p>
                  <p className="mt-4 text-lp-blue">Consultar controles y fuente oficial →</p>
                </a>
              ))}
            </div>
          </>
        )}
        {path.startsWith("/sectores/") && (
          <div className="prose-lumina max-w-3xl">
            <h2>De la información sectorial a una intervención medible</h2>
            <p>
              En {title.toLowerCase()}, el diagnóstico comienza por las decisiones recurrentes, las
              fuentes autorizadas y la definición de los indicadores. Se revisan registros de
              actividad, incidencias, contratos y datos financieros según el objetivo. El alcance no
              se amplía a datos sensibles sin una base jurídica y controles apropiados.
            </p>
            <p>{sectorProfile(slug).focus}</p>
            <h2>Qué se revisa primero en {title.toLowerCase()}</h2>
            <ul className="mt-5 space-y-3">
              {sectorProfile(slug).puntos.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <h2>Proceso</h2>
            <p>
              Inventario y calidad del dato; extracción y conciliación; análisis de causas y
              escenarios; revisión de evidencias y entrega. Un archivo aislado no permite inferir el
              comportamiento de todo el sector ni calcular ahorros garantizados.
            </p>
            <h2>Soluciones vinculadas</h2>
            <ul className="mt-5 space-y-3">
              {solutionAreas.map((a) => (
                <li key={a.href}>
                  <a href={a.href} className="font-semibold text-lp-blue">
                    {a.label}
                  </a>{" "}
                  — {a.desc}
                </li>
              ))}
            </ul>
          </div>
        )}
        {isSector && (
          <AgentActivator
            section="tu actividad"
            options={sectorAgents(slug)}
            defaultAgent={sectorAgents(slug)[0]?.slug}
            sector={title}
          />
        )}
        {path === "/condiciones" && (
          <div className="prose-lumina max-w-3xl">
            <h2>Prueba y servicio</h2>
            <p>
              Una prueba gratuita por cuenta. El diagnóstico de servicio se plantea en 3 días desde
              recibir datos suficientes y autorizados. Los planes posteriores son mensual,
              trimestral o anual; el alcance y la contratación se confirman por escrito. Las
              solicitudes no generan un cobro automático.
            </p>
            <h2>Responsabilidad y límites</h2>
            <p>
              El usuario debe disponer de autorización para los datos enviados. Las respuestas
              pueden contener errores y deben revisarse antes de tomar decisiones. No se garantiza
              ahorro, rentabilidad ni posicionamiento. Los casos publicados como ilustrativos no son
              referencias de clientes.
            </p>
            <h2>Revisión jurídica</h2>
            <p>
              Las condiciones definitivas de pago, cancelación, duración y tratamiento de datos
              deben incorporarse al contrato antes de comercializar el servicio.
            </p>
          </div>
        )}
        {path === "/accesibilidad" && (
          <div className="prose-lumina max-w-3xl">
            <h2>Acceso y mejora continua</h2>
            <p>
              La web incorpora navegación por teclado, etiquetas de formularios y reducción de
              movimiento. WCAG 2.2 es la referencia de mejora; no afirmamos una certificación de
              conformidad sin una auditoría completa.
            </p>
            <h2>Comunicar una barrera</h2>
            <p>
              Escribe a atteencliente.022@gmail.com con la página, la acción y la dificultad
              encontrada. Evita incluir datos sensibles. Se revisarán las barreras y alternativas de
              acceso.
            </p>
            <a href="https://www.w3.org/TR/WCAG22/" className="text-lp-blue underline">
              W3C · WCAG 2.2
            </a>
          </div>
        )}
        {isAbout && (
          <img
            src={workshop.url}
            alt="Ilustración de una reunión con análisis de gráficos"
            className="mt-12 max-h-96 w-full object-contain"
          />
        )}
        <div className="mt-14 flex flex-wrap gap-4 border-t border-lp-line pt-8">
          <Button asChild>
            <a href="/app">Prueba gratis · solo una vez</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/suscripciones">Suscripción mensual, trimestral o anual</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
