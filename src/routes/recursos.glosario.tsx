import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/meta";
import { useState } from "react";
const terms=[
["Agente de IA","Sistema que usa un modelo para interpretar una tarea y proponer o ejecutar pasos mediante herramientas autorizadas. La autonomía no elimina la necesidad de controles y supervisión."],
["Datos oscuros","Información almacenada que no se utiliza de forma sistemática para decidir. Puede ser estructurada o no estructurada; no equivale necesariamente a datos personales."],
["Dato no estructurado","Información sin un esquema tabular uniforme: documentos, texto, imágenes o audio. Debe extraerse y validarse antes de convertirse en indicadores."],
["ETL / ELT","Procesos de extracción, transformación y carga de datos. Cambian el orden de transformación y carga, pero ambos requieren controles de calidad y linaje."],
["RAG","Generación aumentada por recuperación: aporta documentos relevantes al modelo para responder con contexto. No elimina errores ni garantiza que una cita sustente una conclusión."],
["Embedding","Representación numérica de información utilizada para comparar similitud semántica. La proximidad vectorial no demuestra equivalencia factual."],
["Alucinación","Contenido generado que parece plausible pero no está respaldado por los datos o es incorrecto. Se mitiga con evidencia, evaluación y abstención, no solo con un prompt."],
["Linaje del dato","Registro del origen, transformaciones y usos de un dato. Permite explicar qué fuente sostiene un indicador y cómo se calculó."],
["KPI","Indicador vinculado a un objetivo. Debe definir fórmula, periodo, unidad, fuente y responsable para ser comparable."],
["Churn","Pérdida de clientes o ingresos durante un periodo. Churn de clientes y churn de ingresos tienen denominadores diferentes."],
["CLV","Valor de vida del cliente estimado a partir de ingresos, margen, permanencia y coste. Es un modelo con supuestos, no una cifra cierta del futuro."],
["RFM","Segmentación por recencia, frecuencia y valor monetario. Describe comportamiento observado y necesita adaptación al ciclo comercial."],
["ABC / XYZ","Clasificaciones por importancia económica y variabilidad de demanda. Ayudan a priorizar inventario, pero no sustituyen las restricciones operativas."],
["Backtesting","Evaluación de una predicción usando cortes históricos que simulan el momento real de decisión. Evita validar con información futura."],
["Deriva","Cambio en distribución de datos o relación con el objetivo que puede degradar un modelo. Se detecta con métricas y revisiones periódicas."],
["Seudonimización","Sustitución de identificadores manteniendo información adicional que puede reidentificar. Los datos siguen estando sujetos al RGPD."],
["Anonimización","Tratamiento que impide razonablemente identificar personas. Requiere evaluar riesgo de reidentificación; eliminar nombres no basta."],
["GEO","Prácticas de evaluación de presencia en respuestas de búsqueda con IA. La metodología y las herramientas deben documentarse; no garantiza citaciones."],
["Core Web Vitals","Métricas de experiencia web de Google: LCP, INP y CLS. Evalúan carga, interacción y estabilidad visual, no toda la calidad de un sitio."],
["Inferencia causal","Estimación del efecto de una intervención bajo supuestos explícitos. Una correlación o una predicción por sí solas no demuestran causalidad."],
];
export const Route=createFileRoute('/recursos/glosario')({head:()=>pageHead('Glosario corporativo de datos e IA','Definiciones profesionales de analítica, inteligencia artificial y gobierno del dato.','/recursos/glosario'),component:Page});
function Page(){const[q,setQ]=useState('');return <main className="mx-auto max-w-4xl px-5 pt-36 pb-24"><h1 className="h2-fluid font-extrabold">Glosario de datos e IA</h1><p className="mt-4 text-lp-muted">Conceptos de uso empresarial, con límites de interpretación y lenguaje preciso.</p><input aria-label="Buscar término" placeholder="Buscar término…" value={q} onChange={e=>setQ(e.target.value)} className="mt-8 w-full rounded-md border border-lp-line p-3"/><dl className="mt-8 divide-y divide-lp-line">{terms.filter(([t,d])=>(t+' '+d).toLowerCase().includes(q.toLowerCase())).map(([t,d])=><div key={t} className="py-6"><dt className="text-xl font-bold">{t}</dt><dd className="mt-3 leading-relaxed text-lp-slate">{d}</dd></div>)}</dl><p className="mt-8 text-sm text-lp-muted">Referencias: <a href="https://www.nist.gov/itl/ai-risk-management-framework" className="text-lp-blue underline">NIST AI RMF</a> · <a href="https://www.aepd.es/" className="text-lp-blue underline">AEPD</a> · <a href="https://developers.google.com/search/docs" className="text-lp-blue underline">Google Search Central</a>.</p></main>}
