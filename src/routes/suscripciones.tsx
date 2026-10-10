import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/meta";
import { SubscribeButton, useMySubscription, PaymentTestModeBanner } from "@/components/site/SubscribeButton";
export const Route = createFileRoute("/suscripciones")({
  head: () =>
    pageHead(
      "Planes y precios de los agentes de IA",
      "Planes Básico, Avanzado y Total de agentes de IA para pymes: 60 €/mes, 150 €/trimestre o 250 €/año. Prueba gratuita una vez.",
      "/suscripciones",
    ),
  component: Page,
});
export function Plans() {
  const me = useMySubscription();
  return (
    <section className="py-20">
      <PaymentTestModeBanner />
      <div className="mx-auto max-w-[1180px] px-5">
        <h2 className="h2-fluid font-extrabold">De un hallazgo a una mejora continua</h2>
        <p className="mt-4 inline-flex rounded-lg bg-lp-blue/10 px-4 py-3 font-bold text-lp-blue">
          🎁 Todos los planes incluyen 3 días de prueba gratis. No se cobra nada hasta el 4.º día y puedes cancelar antes sin pagar.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "Básico",
              tag: "Para empezar",
              p: "60 €",
              period: "/mes",
              desc: "Sin permanencia · IVA incluido",
              plan: "lumina_monthly",
              f: [
                "Hasta 15 archivos analizados al mes",
                "10 agentes para cualquier tema de tu negocio",
                "Informe mensual con prioridades y qué hacer primero",
                "Auditoría SEO de tu web y noticias del sector",
                "Posicionamiento SEO con Google Ads, Google Maps y Google Search",
                "Avisos de incidencias de empresa por correo y WhatsApp",
                "Asistente Lumina IA por chat",
                "Blog, glosario de datos e IA y calculadora de pérdidas ocultas",
                "Centro de Seguridad: dónde se tratan tus datos y qué consentiste",
              ],
              note: "Ideal si quieres ver qué encuentran los agentes antes de dar un paso más.",
            },
            {
              n: "Avanzado",
              tag: "Más elegido",
              best: true,
              p: "150 €",
              period: "/trimestre",
              desc: "Solo 50 €/mes · ahorras 30 € al trimestre · IVA incluido",
              wow: "Todo tu departamento de análisis por menos de 1,70 € al día",
              plan: "lumina_quarterly",
              f: [
                "Todo lo del plan Básico, y además:",
                "Hasta 90 archivos analizados al mes, seis veces más que el Básico",
                "30 agentes de 6 áreas: Finanzas, Clientes, Operaciones, Riesgo Legal, SEO Local y SEO Global",
                "Tus análisis los elaboran las tres IAs conectadas: ChatGPT, Claude y Gemini",
                "Informes diarios y semanales con predicciones, no solo un resumen mensual",
                "Simulador de decisiones con escenarios ilimitados: precio, publicidad y contratación",
                "Previsión de tesorería a 13 semanas con alerta de impago antes de que ocurra",
                "Panel de Search Console: clics, posiciones y mapa del sitio enviados a Google",
                "Ideas de palabras clave reales con volumen, competencia y coste por clic",
                "Tu agente se adapta a tu sector: el informe habla el idioma de tu negocio",
                "Historial completo de tus análisis e informes, disponible siempre",
                "Plataforma completa en español e inglés, tú eliges el idioma",
                "Asistente por voz con Lumina, sin límites de uso razonable",
                "Comparador de proveedores, normativa UE y observatorio de IA con tu sector cada mañana",
                "Calculadora de pérdidas ocultas y Centro de Seguridad con tu propio informe",
                "Aviso de incidencias de empresa por correo y WhatsApp",
                "Soporte prioritario: respuesta en menos de 24 horas laborables",
              ],
            },
            {
              n: "Total",
              tag: "Mejor precio",
              p: "250 €",
              period: "/año",
              desc: "Solo 20,83 €/mes · ahorras 470 € al año frente al mensual · IVA incluido",
              plan: "lumina_yearly",
              f: [
                "Todo lo del plan Avanzado, y además:",
                "Los 40 agentes y las 7 áreas, sin límites de área",
                "Análisis ilimitado con uso razonable",
                "Vigilancia 24/7 con avisos inmediatos por correo y WhatsApp",
                "Informes diarios, semanales y mensuales",
                "Analítica prescriptiva, cognitiva y en tiempo real",
                "SEO local, SEO global y búsqueda con IA",
                "Acceso prioritario a las novedades de Lumina",
                "Auditorías SEO de tu web sin límite y vigilancia de competidores",
                "Todos los módulos premium sin límites: simulador, tesorería, Search Console y voz",
                "Comparador de proveedores, normativa UE y observatorio de IA a fondo",
              ],
              note: "Para quien ya decide cada día con datos y no quiere topes.",
            },
          ].map((p) => (
            <article key={p.n} className={`relative flex flex-col rounded-lg border p-7 ${(p as any).best ? "border-lp-blue shadow-lg md:-mt-3" : "border-lp-line"}`}>
              <span className="text-xs font-semibold uppercase tracking-wide text-lp-blue">{p.tag}</span>
              <h3 className="text-xl font-bold">{p.n}</h3>
              <p className="mt-5 text-4xl font-extrabold text-lp-blue">
                {p.p}
                <span className="text-sm font-normal text-lp-muted">{p.period}</span>
              </p>
              <p className="mt-2 text-sm text-lp-muted">{p.desc}</p>
              {(p as any).wow ? (
                <p className="mt-2 rounded-md bg-lp-blue/10 px-3 py-2 text-sm font-semibold text-lp-blue">
                  {(p as any).wow}
                </p>
              ) : null}
              <ul className="mt-6 space-y-3 text-sm">
                {p.f.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
              {(p as any).note ? (
                <p className="mt-5 text-sm text-lp-muted">{(p as any).note}</p>
              ) : null}
              <div className="mt-auto pt-7">
                <SubscribeButton priceId={p.plan} {...me} />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-lp-muted">
          Los avisos por WhatsApp requieren conectar y autorizar el canal; su envío aún no está activo.
        </p>
        <p className="mt-6 text-sm text-lp-muted">
          Pago seguro gestionado por Paddle (Merchant of Record). Garantía de devolución de 30 días: ver <a href="/reembolsos" className="text-lp-blue underline">política de reembolsos</a> y <a href="/condiciones" className="text-lp-blue underline">condiciones</a>. Renovación automática; puedes cambiar de plan o
          cancelar cuando quieras desde "gestionar". Necesitas una cuenta con el correo confirmado.
        </p>
        <p className="mt-3 text-sm text-lp-muted">
          Referencia de mercado: licencias de BI no incluyen necesariamente implantación ni análisis
          documental.{" "}
          <a
            href="https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing"
            className="text-lp-blue underline"
          >
            Microsoft Power BI
          </a>{" "}
          ·{" "}
          <a href="https://www.tableau.com/pricing" className="text-lp-blue underline">
            Tableau
          </a>
          .
        </p>
      </div>
    </section>
  );
}
function Page() {
  return (
    <main className="pt-28">
      <h1 className="mx-auto max-w-[1180px] px-5 pt-10 text-3xl font-extrabold">
        Suscripciones Lumina
      </h1>
      <Plans />
    </main>
  );
}
