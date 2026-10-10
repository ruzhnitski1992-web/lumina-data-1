import { agents, sectors, type Agent } from "@/lib/site-data";

export type SectorProfile = {
  focus: string;
  puntos: string[];
  agents: string[];
};

// Per-sector guidance. Every profile lists the agents that activate first in that
// sector; the same block is offered for any sector not listed (see "otro").
const profiles: Record<string, SectorProfile> = {
  retail: {
    focus:
      "En retail y e-commerce el margen se pierde en descuentos, roturas de stock y clientes que no vuelven. Los agentes cruzan ventas, stock, devoluciones y comportamiento de ficha para cuantificarlo.",
    puntos: [
      "Fugas por descuentos no autorizados y servicios no facturados",
      "Clientes en riesgo de abandono y valor real de cada segmento",
      "Roturas de stock y exceso de inventario conviviendo a la vez",
      "Visibilidad local, ficha y reseñas frente a competidores cercanos",
    ],
    agents: ["rastreador-fugas", "retencion", "valor-cliente", "pricing", "demanda-inventario", "ficha-local", "resenas", "analitica-web"],
  },
  "banca-seguros": {
    focus:
      "En banca y seguros la prioridad es el control: fraude, cumplimiento y calidad de la evidencia documental. Los agentes revisan expedientes, contratos y operaciones anómalas sin decidir por ti.",
    puntos: [
      "Anomalías en pagos, siniestros y operaciones repetidas",
      "Obligaciones contractuales y vencimientos dispersos",
      "Expedientes y documentos fuera del circuito de control",
      "Coste real por producto y por canal de distribución",
    ],
    agents: ["antifraude", "cumplimiento", "contratos", "tesoreria", "guardian-privacidad", "rentabilidad", "auditor"],
  },
  industria: {
    focus:
      "En industria el coste aparece como paradas, mermas y stock inmovilizado. Los agentes analizan mantenimiento, procesos y cadena de suministro para separar lo anecdótico de lo recurrente.",
    puntos: [
      "Paradas y averías repetidas con coste por hora de inactividad",
      "Cuellos de botella y desviaciones del proceso real",
      "Gasto en proveedores fuera de contrato o duplicado",
      "Demanda e inventario: previsión frente a roturas",
    ],
    agents: ["mantenimiento-predictivo", "procesos", "demanda-inventario", "cadena-suministro", "compras-costes", "rentabilidad", "cumplimiento"],
  },
  salud: {
    focus:
      "En salud el límite es el dato sensible: se trabaja con información agregada, minimizada y con base jurídica. Los agentes se centran en listas de espera, suministros y calidad del dato.",
    puntos: [
      "Listas de espera y utilización de recursos agregada",
      "Consumibles y farmacia: desviaciones y stock inmovilizado",
      "Contratos y conciertos con obligaciones y vencimientos",
      "Protección de datos y minimización antes de cualquier análisis",
    ],
    agents: ["guardian-privacidad", "cumplimiento", "procesos", "voz-cliente", "talento", "contratos", "tesoreria"],
  },
  logistica: {
    focus:
      "En logística y transporte el margen depende de la puntualidad y del coste por operación. Los agentes reconstruyen la trazabilidad de cada envío y detectan desviaciones repetidas.",
    puntos: [
      "Entregas fuera de plazo y su coste real por cliente",
      "Rutas, capacidad y operaciones duplicadas",
      "Flota y activos: mantenimiento y disponibilidad",
      "Cobros no facturados y suplementos perdidos",
    ],
    agents: ["cadena-suministro", "procesos", "demanda-inventario", "mantenimiento-predictivo", "tesoreria", "compras-costes", "rastreador-fugas"],
  },
  turismo: {
    focus:
      "En turismo y hostelería la temporada concentra ingresos y la reputación decide. Los agentes trabajan con ocupación, precios, reseñas y estacionalidad.",
    puntos: [
      "Precio óptimo por temporada y canal",
      "Huéspedes o clientes en riesgo de no repetir",
      "Reseñas y reputación frente a competidores de la zona",
      "Ocupación, costes variables y rentabilidad por línea",
    ],
    agents: ["pricing", "retencion", "voz-cliente", "ficha-local", "resenas", "analitica-web", "tesoreria"],
  },
  "servicios-profesionales": {
    focus:
      "En despachos y servicios profesionales el activo es el tiempo y el conocimiento acumulado. Los agentes miden rentabilidad por asunto, revisan contratos y rescatan documentos olvidados.",
    puntos: [
      "Horas trabajadas frente a facturadas por asunto o cliente",
      "Honorarios, supuestos y descuentos sin justificar",
      "Conocimiento repetido: documentos y precedentes sin explotar",
      "Autoridad, contenido y captación en buscadores",
    ],
    agents: ["rentabilidad", "contratos", "relator", "cumplimiento", "voz-cliente", "autoridad", "arqueologo"],
  },
  "sector-publico": {
    focus:
      "En el sector público importa la trazabilidad y el control: quién decide, con qué dato y bajo qué norma. Los agentes inventarían fuentes, revisan expedientes y documentan cada hallazgo.",
    puntos: [
      "Expedientes y documentos sin catalogar ni localizar",
      "Contratos y subvenciones con obligaciones de justificación",
      "Procesos administrativos con pasos repetidos o bloqueados",
      "Calidad, linaje y responsabilidad de cada dato publicado",
    ],
    agents: ["cumplimiento", "guardian-privacidad", "cartografo", "auditor", "procesos", "compras-costes", "relator"],
  },
};

// Any sector not in the list: the core swarm is offered, adaptable to the client's activity.
const fallback: SectorProfile = {
  focus:
    "Tu sector no está en la lista: el enjambre se configura igualmente. Los agentes del núcleo inventarían tus fuentes, validan cada hallazgo y lo traducen a euros antes de proponer acción.",
  puntos: [
    "Inventario de fuentes y documentos que nunca se analizan",
    "Hallazgos validados con cita y puntuación de confianza",
    "Impacto económico estimado de cada prioridad",
    "Informe ejecutivo con plan 30-60-90 días",
  ],
  agents: ["orquestador", "arqueologo", "cartografo", "auditor", "financiero", "relator", "guardian-privacidad"],
};

export function sectorProfile(sector: string): SectorProfile {
  const key = Object.keys(profiles).find((k) => sector === k || sector.endsWith(`/${k}`));
  return profiles[key ?? ""] ?? fallback;
}

export function sectorAgents(sector: string): Agent[] {
  const slugs = sectorProfile(sector).agents;
  return slugs
    .map((slug) => agents.find((a) => a.slug === slug))
    .filter((a): a is Agent => a !== undefined);
}

export const sectorList = sectors.map((s) => ({
  slug: s.href.split("/").at(-1) ?? "",
  label: s.label,
}));
