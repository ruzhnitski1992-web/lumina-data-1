import {
  Network, Pickaxe, Map, ShieldCheck, FileText, Lock, Euro, Droplets, Wallet, ShieldAlert, ShoppingCart, PieChart,
  UserMinus, MessageSquare, Gem, Tag, Layers, LineChart, Package, Workflow, Truck, Wrench, Users, FileSignature,
  ClipboardCheck, Radar, MapPin, Star, ListChecks, Search, Grid3x3, Globe, KeyRound, Gauge, PenTool, Link2,
  Swords, Sparkles, Braces, BarChart3, Megaphone, Settings, Database, Store, Landmark, Factory, HeartPulse,
  Plane, Briefcase, Building2, BookOpen, Calculator, Shield, Activity, Brain, Lightbulb, TrendingUp, Clock,
  type LucideIcon,
} from "lucide-react";

export type Agent = { slug: string; name: string; mission: string; deliverable: string; icon: LucideIcon; category: string };

const a = (slug: string, name: string, mission: string, deliverable: string, icon: LucideIcon, category: string): Agent => ({ slug, name, mission, deliverable, icon, category });

export const agentCategories = [
  { id: "nucleo", name: "Núcleo del enjambre" },
  { id: "finanzas", name: "Finanzas y Control" },
  { id: "clientes", name: "Clientes y Ventas" },
  { id: "operaciones", name: "Operaciones y Personas" },
  { id: "riesgo", name: "Riesgo, Legal y Cumplimiento" },
  { id: "seo-local", name: "SEO Local" },
  { id: "seo-ia", name: "SEO Global y Búsqueda con IA" },
] as const;

export const agents: Agent[] = [
  a("orquestador", "Agente Orquestador", "Coordina el enjambre, reparte tareas y prioriza hallazgos por impacto económico.", "Mapa de prioridades", Network, "nucleo"),
  a("arqueologo", "Agente Arqueólogo", "Excava en correos, chats y documentos olvidados para descubrir patrones y riesgos ocultos.", "Inventario de hallazgos", Pickaxe, "nucleo"),
  a("cartografo", "Agente Cartógrafo", "Inventaría las fuentes, mapea su estructura y documenta el linaje del dato.", "Mapa de fuentes", Map, "nucleo"),
  a("auditor", "Agente Auditor", "Contrasta cada hallazgo con varias fuentes y asigna una puntuación de confianza.", "Informe de validación", ShieldCheck, "nucleo"),
  a("relator", "Agente Relator", "Convierte los resultados en informes ejecutivos para el comité de dirección.", "Informe ejecutivo", FileText, "nucleo"),
  a("guardian-privacidad", "Agente Guardián de Privacidad", "Detecta y anonimiza datos personales y aplica la minimización del RGPD.", "Registro de anonimización", Lock, "nucleo"),
  a("financiero", "Agente Financiero", "Traduce cada hallazgo a euros: ingresos en riesgo, costes evitables y retorno.", "Impacto en euros", Euro, "finanzas"),
  a("rastreador-fugas", "Agente Rastreador de Fugas", "Localiza fugas de ingresos: descuentos no autorizados y servicios no facturados.", "Mapa de fugas", Droplets, "finanzas"),
  a("tesoreria", "Agente de Tesorería", "Previsión de flujo de caja, periodo medio de cobro y riesgo de morosidad.", "Previsión de caja", Wallet, "finanzas"),
  a("antifraude", "Agente Antifraude", "Detecta anomalías en pagos y gastos y facturas duplicadas.", "Alertas de anomalías", ShieldAlert, "finanzas"),
  a("compras-costes", "Agente de Compras y Costes", "Analiza gasto por proveedor y categoría y desviaciones presupuestarias.", "Cuadro de gasto", ShoppingCart, "finanzas"),
  a("rentabilidad", "Agente de Rentabilidad", "Calcula el margen real por cliente, producto y canal.", "Mapa de márgenes", PieChart, "finanzas"),
  a("retencion", "Agente de Retención", "Predice qué clientes van a cancelar y por qué.", "Lista de riesgo de churn", UserMinus, "clientes"),
  a("voz-cliente", "Agente Voz del Cliente", "Mide el sentimiento en correos, tickets, encuestas y reseñas.", "Barómetro de sentimiento", MessageSquare, "clientes"),
  a("valor-cliente", "Agente de Valor de Cliente", "Calcula el CLV y segmenta con el modelo RFM.", "Segmentación RFM", Gem, "clientes"),
  a("pricing", "Agente de Pricing", "Estima la elasticidad y el precio óptimo por segmento.", "Recomendación de precios", Tag, "clientes"),
  a("venta-cruzada", "Agente de Venta Cruzada", "Análisis de cesta y oportunidades de upselling.", "Oportunidades de venta", Layers, "clientes"),
  a("prevision-comercial", "Agente de Previsión Comercial", "Previsión de ventas y salud del pipeline.", "Forecast comercial", LineChart, "clientes"),
  a("demanda-inventario", "Agente de Demanda e Inventario", "Previsión de demanda y stock óptimo (ABC/XYZ).", "Plan de inventario", Package, "operaciones"),
  a("procesos", "Agente de Procesos", "Minería de procesos para detectar cuellos de botella y retrabajos.", "Mapa de procesos", Workflow, "operaciones"),
  a("cadena-suministro", "Agente de Cadena de Suministro", "Riesgo de proveedores, plazos y cumplimiento de entregas.", "Scoring de proveedores", Truck, "operaciones"),
  a("mantenimiento-predictivo", "Agente de Mantenimiento Predictivo", "Anticipa averías a partir de sensores e históricos.", "Calendario predictivo", Wrench, "operaciones"),
  a("talento", "Agente de Talento", "Rotación, absentismo y clima laboral con datos agregados y anonimizados.", "Panel de talento", Users, "operaciones"),
  a("contratos", "Agente de Contratos", "Extrae cláusulas, vencimientos, renovaciones tácitas y penalizaciones.", "Calendario contractual", FileSignature, "riesgo"),
  a("cumplimiento", "Agente de Cumplimiento", "Verifica controles internos y genera evidencias para auditorías.", "Dossier de evidencias", ClipboardCheck, "riesgo"),
  a("centinela", "Agente Centinela", "Monitorización continua y alertas cuando un indicador se desvía.", "Alertas en tiempo real", Radar, "riesgo"),
  a("ficha-local", "Agente de Ficha Local", "Optimiza y supervisa el Perfil de Empresa en Google.", "Auditoría de ficha", MapPin, "seo-local"),
  a("resenas", "Agente de Reseñas", "Monitoriza reseñas y redacta respuestas que una persona aprueba. Nunca genera reseñas.", "Panel de reputación", Star, "seo-local"),
  a("nap-citaciones", "Agente NAP y Citaciones", "Garantiza que nombre, dirección y teléfono coincidan en todos los directorios.", "Informe NAP", ListChecks, "seo-local"),
  a("geo-keywords", "Agente Geo-Keywords", "Palabras clave por ciudad, barrio y búsquedas «cerca de mí».", "Mapa de keywords locales", Search, "seo-local"),
  a("mapa-local", "Agente de Mapa Local", "Posición en el mapa de Google por cuadrícula geográfica frente a la competencia.", "Geo-grid", Grid3x3, "seo-local"),
  a("paginas-locales", "Agente de Páginas Locales", "Páginas por ubicación y servicio con contenido único, nunca páginas puerta.", "Plan de páginas locales", Globe, "seo-local"),
  a("palabras-clave", "Agente de Palabras Clave", "Intención de búsqueda, volumen, dificultad y clusters temáticos.", "Mapa de clusters", KeyRound, "seo-ia"),
  a("seo-tecnico", "Agente SEO Técnico", "Rastreo, indexación, Core Web Vitals, canonicals y sitemap.", "Auditoría técnica", Gauge, "seo-ia"),
  a("contenidos-eeat", "Agente de Contenidos E-E-A-T", "Arquitectura de contenidos, briefings y actualización de páginas.", "Plan editorial", PenTool, "seo-ia"),
  a("autoridad", "Agente de Autoridad", "Auditoría de enlaces y oportunidades legítimas de relaciones públicas digitales.", "Informe de autoridad", Link2, "seo-ia"),
  a("competencia-serp", "Agente de Competencia SERP", "Cuota de visibilidad y brechas de contenido frente a competidores.", "Benchmark SERP", Swords, "seo-ia"),
  a("geo", "Agente GEO", "Mide y mejora la presencia de la marca en respuestas de buscadores y asistentes con IA.", "Índice de visibilidad IA", Sparkles, "seo-ia"),
  a("datos-estructurados", "Agente de Datos Estructurados", "Implementa y valida el marcado schema.org.", "Marcado validado", Braces, "seo-ia"),
  a("analitica-web", "Agente de Analítica Web", "GA4, Search Console, conversiones y atribución.", "Panel de conversión", BarChart3, "seo-ia"),
];

export type NavItem = { label: string; href: string; desc?: string; icon?: LucideIcon };
export const aiProviders: NavItem[] = [
  { label: "ChatGPT · OpenAI", href: "/ias/chatgpt", desc: "Análisis, razonamiento y síntesis de negocio", icon: MessageSquare },
  { label: "Claude · Anthropic", href: "/ias/claude", desc: "Documentos, contratos y respuestas con contexto", icon: FileText },
  { label: "Gemini · Google", href: "/ias/gemini", desc: "Interpretación y contraste de información", icon: Brain },
];

export const solutionAreas: NavItem[] = [
  { label: "Finanzas y Control", href: "/soluciones/finanzas", desc: "Fugas de ingresos, tesorería y márgenes", icon: Euro },
  { label: "Ventas y Clientes", href: "/soluciones/clientes", desc: "Churn, CLV, pricing y previsión", icon: Users },
  { label: "Marketing", href: "/soluciones/marketing", desc: "Atribución, ROI y audiencias", icon: Megaphone },
  { label: "SEO Local", href: "/soluciones/seo-local", desc: "Ficha de Google, reseñas y mapa", icon: MapPin },
  { label: "SEO Global y Búsqueda con IA", href: "/soluciones/seo-ia", desc: "Keywords, técnica y GEO", icon: Sparkles },
  { label: "Operaciones y Cadena de Suministro", href: "/soluciones/operaciones", desc: "Demanda, inventario y procesos", icon: Settings },
  { label: "Personas y Talento", href: "/soluciones/personas", desc: "Rotación y clima, siempre anonimizado", icon: Users },
  { label: "Riesgo, Legal y Cumplimiento", href: "/soluciones/riesgo-legal", desc: "Contratos y auditoría continua", icon: Shield },
  { label: "Datos Oscuros y Documentos", href: "/soluciones/datos-oscuros", desc: "Correos, chats, OCR e IDP", icon: FileText },
  { label: "Gobierno del Dato", href: "/soluciones/gobierno-del-dato", desc: "Calidad, catálogo y linaje", icon: Database },
];

export const sectors: NavItem[] = [
  { label: "Retail y e-commerce", href: "/sectores/retail", icon: Store },
  { label: "Banca y Seguros", href: "/sectores/banca-seguros", icon: Landmark },
  { label: "Industria", href: "/sectores/industria", icon: Factory },
  { label: "Salud", href: "/sectores/salud", icon: HeartPulse },
  { label: "Logística y Transporte", href: "/sectores/logistica", icon: Truck },
  { label: "Turismo y Hostelería", href: "/sectores/turismo", icon: Plane },
  { label: "Despachos y Servicios Profesionales", href: "/sectores/servicios-profesionales", icon: Briefcase },
  { label: "Sector Público", href: "/sectores/sector-publico", icon: Building2 },
];

export const analytics: NavItem[] = [
  { label: "Descriptiva", href: "/analitica/descriptiva", desc: "¿Qué ha pasado?", icon: BarChart3 },
  { label: "Diagnóstica", href: "/analitica/diagnostica", desc: "¿Por qué ha pasado?", icon: Search },
  { label: "Predictiva", href: "/analitica/predictiva", desc: "¿Qué va a pasar?", icon: TrendingUp },
  { label: "Prescriptiva", href: "/analitica/prescriptiva", desc: "¿Qué debemos hacer?", icon: Lightbulb },
  { label: "Cognitiva", href: "/analitica/cognitiva", desc: "¿Qué dicen nuestros textos?", icon: Brain },
  { label: "Tiempo real", href: "/analitica/tiempo-real", desc: "¿Qué está pasando ahora?", icon: Activity },
  { label: "Catálogo de técnicas", href: "/analitica", desc: "Todas las técnicas analíticas", icon: Layers },
];

export const resources: NavItem[] = [
  { label: "Noticias de analítica mundial", href: "/noticias", desc: "Novedades por área con fecha y fuente", icon: Globe },
  { label: "Observatorio IA", href: "/observatorio-ia", desc: "Novedades diarias de IA con fuente", icon: Sparkles },
  { label: "Robótica", href: "/robotica", desc: "Investigación y normativa", icon: Settings },
  { label: "Datos mundiales", href: "/datos-mundiales", desc: "Indicadores oficiales en directo", icon: Globe },
  { label: "Glosario de datos e IA", href: "/recursos/glosario", desc: "Términos clave explicados", icon: FileText },
  { label: "Calculadora de pérdidas ocultas", href: "/calculadora-de-perdidas", desc: "Estima tus ingresos en riesgo", icon: Calculator },
  { label: "Centro de Seguridad", href: "/seguridad", desc: "Privacidad y gobierno de la IA", icon: Lock },
];

export const company: NavItem[] = [
  { label: "Sobre nosotros", href: "/empresa/sobre-nosotros" },
  { label: "Planes y precios", href: "/suscripciones" },
];

export const legal: NavItem[] = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Política de cookies", href: "/cookies" },
  { label: "Condiciones de uso", href: "/condiciones" },
  { label: "Política de reembolsos", href: "/reembolsos" },
  { label: "Accesibilidad", href: "/accesibilidad" },
];

export { Clock };
