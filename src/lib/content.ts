export type Detail = {
  summary: string;
  challenge: string;
  methods: string;
  metrics: string;
  outcome: string;
  category: string;
  source: string;
  sourceName: string;
};
const nist = "https://www.nist.gov/itl/ai-risk-management-framework";
const google = "https://developers.google.com/search/docs/fundamentals/creating-helpful-content";
export const details: Record<string, Detail> = {
  finanzas: {
    summary: "Control financiero basado en evidencias: del documento operativo al margen real.",
    challenge:
      "La facturación, los contratos y las excepciones comerciales suelen vivir en sistemas distintos. Sin conciliación, una venta registrada puede no convertirse en caja y un margen aparente puede ocultar costes de servicio.",
    methods:
      "Conciliación de documentos, detección de duplicados, análisis de variaciones y segmentación del margen de contribución. Las previsiones de caja requieren históricos fiables y escenarios separados; una anomalía se investiga, no se considera fraude automáticamente.",
    metrics:
      "DSO, margen de contribución, desviación presupuestaria, vencimientos y porcentaje de partidas conciliadas. Cada cifra debe conservar periodo, denominador, moneda y fuente.",
    outcome:
      "Inventario de excepciones con evidencia, estimación de impacto y responsable. Prioridad por materialidad y plan de conciliación, recuperación o renegociación sujeto a aprobación.",
    category: "finanzas",
    source: "https://www.ifrs.org/issued-standards/",
    sourceName: "IFRS · normas de información financiera",
  },
  clientes: {
    summary:
      "Unir señales comerciales y de servicio para entender la permanencia y el valor del cliente.",
    challenge:
      "Las quejas llegan antes que las cancelaciones, pero a menudo no se cruzan con la facturación o el CRM. El riesgo de abandono no puede atribuirse a una única palabra ni a un indicador aislado.",
    methods:
      "Segmentación RFM, cohortes, análisis de tickets, previsión comercial y evaluación temporal de modelos de churn. La recomendación de precios exige datos de demanda y controles para evitar confundir correlación con elasticidad.",
    metrics:
      "Retención por cohorte, conversión, valor de vida estimado, margen por cuenta, error de previsión y precisión de alertas. Se distinguen ingresos en riesgo de ingresos realmente recuperados.",
    outcome:
      "Lista priorizada de cuentas con motivos verificables, propuestas de retención y oportunidades de venta cruzada. Un comercial valida cada intervención antes de contactar al cliente.",
    category: "clientes",
    source: nist,
    sourceName: "NIST · evaluación y gestión del riesgo de IA",
  },
  marketing: {
    summary: "Medición de marketing que conecta inversión, conversión y margen, no solo clics.",
    challenge:
      "La atribución de último clic puede sobrerrepresentar canales de cierre y ocultar la contribución de marca. Los identificadores incompletos, consentimientos y devoluciones cambian el resultado.",
    methods:
      "Análisis de embudos, cohortes, conciliación de gasto publicitario y pedidos, experimentos de incrementalidad y modelos de mezcla de marketing cuando hay series suficientes. Los modelos de atribución son supuestos, no causalidad demostrada.",
    metrics:
      "CAC, ROAS con devoluciones, margen incremental, tasa de conversión y tiempo de recuperación del CAC. Comparación con periodos homogéneos y estacionalidad documentada.",
    outcome:
      "Mapa de inversión y medición, brechas de seguimiento y escenarios presupuestarios. Las campañas y los cambios de inversión se aprueban antes de ejecutarse.",
    category: "seo-ia",
    source: "https://support.google.com/analytics/answer/10596866",
    sourceName: "Google Analytics · atribución",
  },
  "seo-local": {
    summary: "Visibilidad local coherente con ubicaciones reales y servicios acreditables.",
    challenge:
      "Las fichas desactualizadas, horarios inconsistentes y páginas repetidas dificultan encontrar un negocio. La posición depende de relevancia, distancia y notoriedad; nadie puede garantizar una primera posición.",
    methods:
      "Revisión del Perfil de Empresa, consistencia de citaciones, análisis geográfico de búsquedas y auditoría de páginas locales. Respuestas a reseñas reales con validación humana; sin reseñas falsas ni páginas puerta.",
    metrics:
      "Interacciones de ficha, solicitudes de indicaciones, clics al sitio y posiciones por ubicación y fecha. Las métricas no equivalen automáticamente a ventas.",
    outcome:
      "Auditoría priorizada de ficha y citaciones, calendario de mejoras y contenido específico para cada ubicación legítima. Las publicaciones se realizan solo con autorización y acceso conectado.",
    category: "seo-local",
    source: "https://support.google.com/business/answer/7091",
    sourceName: "Google · cómo mejorar el posicionamiento local",
  },
  "seo-ia": {
    summary: "SEO técnico y contenido útil para buscadores y experiencias de búsqueda con IA.",
    challenge:
      "Indexación, duplicidades y contenido sin evidencia afectan la visibilidad. La aparición en respuestas de IA es variable: no existe una garantía universal de citación ni un marcado especial que asegure presencia.",
    methods:
      "Rastreo técnico, intención de búsqueda, estructura de enlaces, Core Web Vitals y datos estructurados válidos. Evaluación de menciones con un conjunto fijo de preguntas y registro de fecha, herramienta y respuesta.",
    metrics:
      "Cobertura de indexación, clics, impresiones, conversiones orgánicas y menciones observadas. Los resultados se comparan por país, dispositivo y tipo de consulta.",
    outcome:
      "Backlog técnico, mapa temático y briefings con fuentes. Correcciones y publicaciones se revisan antes de producción; se evita contenido masivo sin valor y compra de enlaces manipulativa.",
    category: "seo-ia",
    source: google,
    sourceName: "Google Search Central · contenido útil y fiable",
  },
  operaciones: {
    summary: "Reducir incertidumbre operativa con demanda, inventario y procesos observables.",
    challenge:
      "El exceso de stock y las roturas pueden coexistir cuando la previsión no considera plazos, promociones y variabilidad. Una demora aislada no demuestra que un proveedor sea poco fiable.",
    methods:
      "Clasificación ABC/XYZ, previsión con validación retrospectiva, análisis de lead time y minería de procesos a partir de eventos reales. Optimización restringida por capacidad, nivel de servicio y coste.",
    metrics:
      "OTIF, rotación, cobertura, stockouts, error de previsión WAPE y tiempo de ciclo. Los eventos deben tener identificador de caso, actividad y fecha para reconstruir el proceso.",
    outcome:
      "Plan de inventario por escenario, excepciones de proveedor y cuellos de botella con evidencia. Compras, movimientos de stock y cambios operativos requieren aprobación.",
    category: "operaciones",
    source: "https://www.nist.gov/manufacturing",
    sourceName: "NIST · investigación en fabricación",
  },
  personas: {
    summary: "Analítica de personas agregada, proporcional y orientada a mejorar la organización.",
    challenge:
      "Datos de plantilla, absentismo y clima requieren especial prudencia. La analítica no debe convertirse en vigilancia individual ni en una decisión laboral automatizada con efectos significativos.",
    methods:
      "Cohortes agregadas, tendencias de rotación, análisis de encuestas y calidad de datos. Supresión de grupos pequeños, acceso restringido y evaluación de impacto cuando corresponda.",
    metrics:
      "Rotación por colectivo, antigüedad, cobertura de formación y resultados agregados de clima. Se evita inferir salud, emociones o atributos sensibles de personas.",
    outcome:
      "Diagnóstico organizativo con límites de interpretación y acciones para revisión por RR. HH. No se automatizan contratación, despido ni evaluación individual.",
    category: "operaciones",
    source: "https://www.aepd.es/guias/la-proteccion-de-datos-en-las-relaciones-laborales.pdf",
    sourceName: "AEPD · protección de datos en las relaciones laborales",
  },
  "riesgo-legal": {
    summary:
      "Contratos, controles y evidencias con criterio de materialidad y revisión profesional.",
    challenge:
      "Renovaciones tácitas, vencimientos y cláusulas dispersas pueden pasar inadvertidos. Una extracción automática no sustituye la interpretación jurídica ni acredita por sí sola cumplimiento normativo.",
    methods:
      "Extracción de obligaciones, calendario contractual, detección de discrepancias y contraste de controles. Cada conclusión enlaza con el fragmento de origen y señala información faltante.",
    metrics:
      "Contratos revisados, vencimientos próximos, controles con evidencia y excepciones pendientes. Los riesgos se clasifican por impacto y probabilidad, sin fingir certeza.",
    outcome:
      "Dossier de evidencias, alertas y plan de revisión. Un profesional competente confirma la interpretación y cualquier notificación o modificación contractual.",
    category: "riesgo",
    source: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    sourceName: "Unión Europea · Reglamento de Inteligencia Artificial",
  },
  "datos-oscuros": {
    summary: "Convertir documentos infrautilizados en conocimiento trazable y accionable.",
    challenge:
      "PDFs, correos y conversaciones suelen quedar fuera del reporting. La extracción puede perder tablas, fechas o contexto; un documento escaneado exige OCR y control de calidad.",
    methods:
      "Inventario, clasificación documental, extracción de texto y detección de entidades. Separación entre hechos citados, hipótesis e información insuficiente. Los documentos se tratan como datos, nunca como instrucciones del sistema.",
    metrics:
      "Cobertura de extracción, campos faltantes, duplicados y hallazgos con cita verificable. La confidencialidad y los permisos se revisan antes de ampliar el alcance.",
    outcome:
      "Informe de hallazgos y fuentes con prioridades de negocio. El análisis inicial de un archivo no equivale a integrar todos los sistemas corporativos.",
    category: "nucleo",
    source: nist,
    sourceName: "NIST · AI Risk Management Framework",
  },
  "gobierno-del-dato": {
    summary: "Un dato útil necesita propietario, definición, calidad y un uso permitido.",
    challenge:
      "Dos departamentos pueden calcular el mismo KPI de manera distinta. Sin linaje, versión y responsabilidad, los informes no son comparables y las decisiones pierden confianza.",
    methods:
      "Catálogo de fuentes, diccionario de negocio, reglas de calidad, clasificación de sensibilidad y linaje. Revisiones de permisos y retención de acuerdo con la finalidad acordada.",
    metrics:
      "Completitud, unicidad, validez, actualidad y consistencia. Cada regla define umbral, responsable y procedimiento de resolución de incidencias.",
    outcome:
      "Catálogo operativo, matriz de responsabilidades y backlog de calidad. Un comité de datos valida definiciones y prioridades; la herramienta no certifica cumplimiento automáticamente.",
    category: "nucleo",
    source: "https://www.aepd.es/",
    sourceName: "AEPD · autoridad española de protección de datos",
  },
};
export const analyticDetails: Record<
  string,
  { technique: string; requirements: string; validation: string; example: string }
> = {
  descriptiva: {
    technique: "Agregación, estadística descriptiva, cohortes, OLAP y visualización.",
    requirements: "Definiciones compartidas de KPI, dimensiones, periodos y granularidad.",
    validation:
      "Conciliar totales con el sistema de origen, revisar duplicados y documentar filtros.",
    example:
      "Ventas netas por canal, región y cohorte después de devoluciones. Microsoft Power BI y Tableau documentan estas capacidades de modelado y reporting.",
  },
  diagnostica: {
    technique:
      "Descomposición de variaciones, Pareto, análisis de segmentos y minería de procesos.",
    requirements:
      "Histórico de eventos y variables explicativas; comparaciones entre grupos equivalentes.",
    validation:
      "Buscar hipótesis alternativas, controlar cambios de mezcla y no presentar correlación como causalidad.",
    example:
      "Distinguir si el margen cayó por precio, mix, devoluciones o coste unitario antes de proponer una intervención.",
  },
  predictiva: {
    technique: "Series temporales, regresión, clasificación y detección de anomalías.",
    requirements:
      "Históricos suficientes, etiquetas fiables y separación temporal entre entrenamiento y prueba.",
    validation:
      "Backtesting, comparación con un baseline, error por segmento y seguimiento de deriva.",
    example:
      "Previsión de demanda con intervalos de incertidumbre; el resultado se valida frente a una previsión ingenua y no promete exactitud absoluta.",
  },
  prescriptiva: {
    technique:
      "Optimización matemática, simulación de escenarios y reglas de decisión restringidas.",
    requirements:
      "Objetivo explícito, restricciones de capacidad, presupuesto, riesgo y nivel de servicio.",
    validation:
      "Análisis de sensibilidad y viabilidad; escenarios fuera del histórico requieren prudencia adicional.",
    example:
      "Distribuir stock limitado entre centros respetando capacidad y nivel de servicio, con aprobación del responsable de operaciones.",
  },
  cognitiva: {
    technique:
      "Procesamiento del lenguaje, extracción documental, búsqueda semántica y generación con evidencia.",
    requirements: "Documentos autorizados, fuentes identificadas y control de extracción.",
    validation:
      "Comprobar citas y campos extraídos, evaluar muestras y registrar abstenciones cuando faltan datos.",
    example:
      "Localizar obligaciones y vencimientos en contratos. La respuesta distingue cita literal de interpretación y no sustituye asesoramiento jurídico.",
  },
  "tiempo-real": {
    technique: "Procesamiento de eventos, ventanas temporales y alertas por umbral o anomalía.",
    requirements:
      "Fuentes conectadas, latencia objetivo, orden de eventos y política de recuperación.",
    validation:
      "Medir retrasos, eventos perdidos y falsos positivos. Tiempo real no significa latencia cero.",
    example:
      "Detectar una desviación operativa al recibir eventos autorizados. Esta modalidad requiere integración específica; no está activa por subir un documento.",
  },
};
export const securityTopics = [
  {
    slug: "proteccion-datos",
    title: "RGPD y protección de datos",
    text: "El RGPD exige licitud, transparencia, limitación de finalidad, minimización, exactitud, conservación limitada y seguridad. El responsable determina la base jurídica; el consentimiento no es la base adecuada para todos los tratamientos. Antes de analizar información se debe identificar la finalidad, las categorías de datos, los destinatarios y las transferencias. Un contrato de encargo debe describir las instrucciones y los proveedores. Las solicitudes de acceso, rectificación, supresión y demás derechos se atienden mediante el correo de privacidad publicado.",
    source: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
  {
    slug: "reglamento-ia",
    title: "Reglamento Europeo de IA",
    text: "El Reglamento (UE) 2024/1689 adopta un enfoque basado en riesgos y tiene aplicación escalonada. La clasificación depende del uso previsto, no solo del modelo utilizado. Deben evaluarse las obligaciones de transparencia, alfabetización en IA, documentación y supervisión. Los usos laborales y otros ámbitos sensibles pueden estar sujetos a obligaciones adicionales. Esta página describe criterios de diseño y no acredita una certificación ni una evaluación de conformidad de Lumina.",
    source: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    slug: "seguridad-tecnica",
    title: "Seguridad técnica y acceso",
    text: "La protección se basa en acceso autenticado y aislamiento de los historiales por cuenta. Los secretos de los proveedores permanecen en el servidor. Los informes se leen solo por su propietario y la prueba se registra de forma atómica. Las políticas corporativas deben añadir revisión periódica de accesos, recuperación y gestión de incidentes. No afirmamos disponer de certificaciones ISO 27001, ENS o SOC 2, ni de una residencia exclusiva en la UE sin una verificación contractual de todos los servicios.",
    source: "https://www.incibe.es/empresas",
  },
  {
    slug: "minimizacion",
    title: "Minimización y anonimización",
    text: "Sube solo datos necesarios y para los que tengas autorización. Elimina nombres, identificadores y categorías especiales cuando no aporten valor. Seudonimizar no equivale a anonimizar: un identificador sustituido puede seguir permitiendo reidentificación. No existe una garantía de anonimización automática para cualquier archivo. La revisión del riesgo de reidentificación y la calidad de extracción forman parte de la evaluación previa.",
    source: "https://www.aepd.es/",
  },
  {
    slug: "supervision",
    title: "Supervisión humana",
    text: "Los agentes generan observaciones y propuestas, no decisiones definitivas. Un responsable confirma fuentes, contexto, cálculos y consecuencias antes de actuar. No se automatizan transferencias bancarias, decisiones laborales o comunicaciones a terceros a partir de una respuesta. Las incertidumbres y datos insuficientes deben aparecer en el informe. La supervisión efectiva requiere competencia, capacidad de detener el proceso y trazabilidad de la aprobación.",
    source: nist,
  },
  {
    slug: "trazabilidad",
    title: "Trazabilidad y gobierno",
    text: "Cada hallazgo debe indicar documento, fragmento, periodo, método y límites. El historial de conversación conserva el contexto por cuenta; los informes iniciales no equivalen a una auditoría certificada. El gobierno del dato exige propietarios y definiciones compartidas de KPI, control de cambios y un plazo de conservación acordado. Los cambios en fuentes o modelos deben reevaluarse para detectar deriva y pérdida de calidad.",
    source: nist,
  },
];
export const illustrativeCases = [
  {
    id: "distribucion",
    title: "Distribuidor B2B · fugas de facturación",
    challenge:
      "Una empresa ficticia de 85 empleados compara 240 albaranes con facturas y condiciones comerciales.",
    process:
      "El Arqueólogo identifica excepciones, el Financiero calcula importes y el Auditor revisa los documentos antes de priorizar partidas.",
    result: "18.600 € en partidas para revisar",
    limit:
      "Escenario: 12 servicios de 1.550 €. No es facturación recuperada ni un resultado real de Lumina.",
  },
  {
    id: "retencion",
    title: "Servicios por suscripción · retención",
    challenge:
      "Una empresa ficticia analiza 120 tickets y 40 cuentas para separar incidencias recurrentes de señales aisladas.",
    process:
      "Voz del Cliente agrupa motivos, Retención contrasta antigüedad y uso, y el responsable comercial decide el contacto.",
    result: "9 cuentas priorizadas",
    limit:
      "Escenario ilustrativo sin clientes reales. La lista no demuestra que las cuentas vayan a cancelar ni que se recuperen ingresos.",
  },
  {
    id: "inventario",
    title: "Retail · equilibrio de inventario",
    challenge:
      "Un comercio ficticio revisa 60 referencias y seis meses de movimientos para encontrar exceso y roturas simultáneas.",
    process:
      "Demanda e Inventario clasifica ABC/XYZ, Compras compara lead time y el equipo evalúa escenarios de reposición.",
    result: "7 referencias con exceso potencial",
    limit:
      "Ejemplo de metodología, no ahorro obtenido. La decisión exige demanda, costes y niveles de servicio reales.",
  },
];
