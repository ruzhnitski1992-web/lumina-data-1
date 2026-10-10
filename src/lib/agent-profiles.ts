import { agents, agentCategories, type Agent } from "@/lib/site-data";

type CategoryProfile = {
  problem: string;
  sources: string[];
  solutions: string[];
  kpis: string[];
  reference: { label: string; url: string };
};

const profiles: Record<string, CategoryProfile> = {
  nucleo: {
    problem: "Se estima que entre el 55 % y el 80 % de la información que generan las empresas son datos no estructurados que nunca se analizan (estimaciones de Gartner e IDC sobre «dark data»).",
    sources: ["Correos y adjuntos", "Chats internos y de clientes", "Carpetas compartidas", "Exportaciones de ERP y CRM"],
    solutions: ["Inventario y clasificación de las fuentes autorizadas", "Detección de patrones, duplicidades y riesgos ocultos", "Validación cruzada con puntuación de confianza", "Priorización de hallazgos por impacto económico"],
    kpis: ["% de fuentes inventariadas", "Hallazgos validados", "Confianza media", "Tiempo hasta el informe"],
    reference: { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
  },
  finanzas: {
    problem: "La fuga de margen por descuentos no autorizados, cobros tardíos y gasto duplicado suele pasar desapercibida en los cierres mensuales.",
    sources: ["Facturas y albaranes", "Extractos bancarios", "Contratos de proveedores", "Hojas de presupuesto"],
    solutions: ["Conciliación automática y alertas de anomalías", "Previsión de tesorería y riesgo de impago", "Detección de gasto duplicado o fuera de contrato", "Cuantificación en euros de cada hallazgo"],
    kpis: ["Días de cobro (DSO)", "Margen bruto", "Gasto evitable", "Desviación presupuestaria"],
    reference: { label: "Banco de España · Central de Balances", url: "https://www.bde.es/wbe/es/areas-actuacion/central-balances/" },
  },
  clientes: {
    problem: "Captar un cliente nuevo cuesta varias veces más que retener uno existente; las señales de abandono suelen estar escritas en correos y conversaciones.",
    sources: ["Historial del CRM", "Tickets de soporte", "Conversaciones y reseñas", "Pedidos y devoluciones"],
    solutions: ["Predicción de abandono con motivos explicados", "Detección de ventas cruzadas y renovaciones", "Análisis de sentimiento de cada interacción", "Priorización de cuentas por valor"],
    kpis: ["Tasa de abandono", "Valor de vida del cliente", "NPS", "Conversión de oportunidades"],
    reference: { label: "INE · Estadísticas de comercio electrónico", url: "https://www.ine.es/" },
  },
  operaciones: {
    problem: "Retrasos, roturas de stock y cuellos de botella generan costes que no aparecen como una línea propia en la cuenta de resultados.",
    sources: ["Órdenes de trabajo", "Inventario y logística", "Partes de incidencias", "Planificación de turnos"],
    solutions: ["Mapeo del proceso real frente al teórico", "Previsión de demanda y stock", "Detección de cuellos de botella", "Análisis de carga de trabajo y rotación"],
    kpis: ["Plazo de entrega", "Rotación de inventario", "Productividad por persona", "Incidencias recurrentes"],
    reference: { label: "Eurostat · Estadísticas empresariales", url: "https://ec.europa.eu/eurostat" },
  },
  riesgo: {
    problem: "Las multas del RGPD pueden alcanzar 20 millones de euros o el 4 % de la facturación global, y el Reglamento de IA de la UE añade nuevas obligaciones.",
    sources: ["Contratos y anexos", "Registros de actividades de tratamiento", "Políticas internas", "Correos con terceros"],
    solutions: ["Revisión de cláusulas y vencimientos", "Mapa de datos personales y minimización", "Seguimiento de obligaciones normativas", "Alertas de riesgo con trazabilidad"],
    kpis: ["Contratos revisados", "Riesgos abiertos", "Plazo de respuesta a derechos", "Hallazgos críticos"],
    reference: { label: "AEPD · Agencia Española de Protección de Datos", url: "https://www.aepd.es/" },
  },
  "seo-local": {
    problem: "Una gran parte de las búsquedas tiene intención local, y la ficha de empresa y las reseñas condicionan qué negocio elige el cliente.",
    sources: ["Perfil de empresa en Google", "Reseñas", "Directorios locales", "Datos de visitas y llamadas"],
    solutions: ["Auditoría de nombre, dirección y horario (NAP)", "Análisis y respuesta guiada a reseñas", "Comparativa con competidores cercanos", "Plan de contenidos por zona"],
    kpis: ["Visibilidad en el mapa", "Valoración media", "Solicitudes de ruta", "Llamadas y clics"],
    reference: { label: "Google · Perfil de Empresa", url: "https://support.google.com/business/" },
  },
  "seo-ia": {
    problem: "Los buscadores con IA responden directamente y citan pocas fuentes: sin datos estructurados y contenido experto, la marca desaparece.",
    sources: ["Analítica web", "Search Console", "Contenido del sitio", "Enlaces y menciones"],
    solutions: ["Auditoría técnica y de datos estructurados", "Optimización para respuestas generativas", "Análisis de intención y huecos de contenido", "Seguimiento de citas en asistentes de IA"],
    kpis: ["Clics orgánicos", "Posición media", "Páginas indexadas", "Menciones en respuestas IA"],
    reference: { label: "Google Search Central", url: "https://developers.google.com/search" },
  },
};

export function agentProfile(agent: Agent) {
  const p = profiles[agent.category] ?? profiles["nucleo"]!;
  const category = agentCategories.find((c) => c.id === agent.category);
  const related = agents.filter((x) => x.category === agent.category && x.slug !== agent.slug).slice(0, 4);
  return { ...p, categoryName: category?.name ?? "Agentes IA", related };
}
