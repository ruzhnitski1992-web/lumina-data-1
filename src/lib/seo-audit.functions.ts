import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SeoCheck = { id: string; ok: boolean; grave: boolean; titulo: string; detalle: string; arreglo: string };
export type SeoAudit = { url: string; final: string; estado: number; ms: number; puntuacion: number; checks: SeoCheck[]; resumen: { title: string; description: string; h1: string[]; palabras: number; enlaces: number; imagenes: number } };

function blocked(host: string) {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const [a, b] = h.split(".").map(Number) as [number, number];
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
  }
  return h.startsWith("[") || h.includes(":");
}

const pick = (html: string, re: RegExp) => (html.match(re)?.[1] ?? "").replace(/\s+/g, " ").trim();
const meta = (html: string, name: string) =>
  pick(html, new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)`, "i")) ||
  pick(html, new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, "i"));

async function get(url: string) {
  return fetch(url, { redirect: "follow", headers: { "user-agent": "LuminaSEOAudit/1.0 (+https://luminadatainsights.com)", accept: "text/html,*/*" }, signal: AbortSignal.timeout(12000) });
}

export const auditSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => {
    let raw = String(input?.url ?? "").trim().slice(0, 500);
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    const u = new URL(raw);
    if (!/^https?:$/.test(u.protocol) || blocked(u.hostname)) throw new Error("Escribe la dirección pública de una web (por ejemplo, tuempresa.com).");
    return { url: u.toString() };
  })
  .handler(async ({ data }): Promise<SeoAudit> => {
    const t0 = Date.now();
    let res: Response;
    try { res = await get(data.url); } catch { throw new Error("No he podido abrir esa web. Comprueba que la dirección es correcta y está publicada."); }
    const ms = Date.now() - t0;
    const final = res.url || data.url;
    if (blocked(new URL(final).hostname)) throw new Error("La web redirige a una dirección no pública.");
    const html = (await res.text()).slice(0, 2_000_000);
    const origin = new URL(final).origin;
    const [robots, sitemap] = await Promise.all([
      get(origin + "/robots.txt").then(async (r) => (r.ok ? await r.text() : "")).catch(() => ""),
      get(origin + "/sitemap.xml").then((r) => r.ok).catch(() => false),
    ]);

    const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = meta(html, "description");
    const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1]!.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).filter(Boolean);
    const h2 = (html.match(/<h2[\s>]/gi) ?? []).length;
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    const sinAlt = imgs.filter((i) => !/\balt=["'][^"']+/i.test(i)).length;
    const texto = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const palabras = texto.split(" ").filter((w) => w.length > 2).length;
    const enlaces = (html.match(/<a\s[^>]*href=/gi) ?? []).length;
    const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const lang = pick(html, /<html[^>]*\blang=["']([^"']+)/i);
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const og = !!meta(html, "og:title") && !!meta(html, "og:image");
    const schema = /application\/ld\+json/i.test(html);
    const noindex = /noindex/i.test(meta(html, "robots"));
    const https = final.startsWith("https://");
    const hsts = !!res.headers.get("strict-transport-security");

    const checks: SeoCheck[] = [
      { id: "status", ok: res.ok, grave: true, titulo: "La página responde correctamente", detalle: `Código ${res.status}`, arreglo: "Revisa que la página exista y no devuelva errores 4xx/5xx." },
      { id: "https", ok: https, grave: true, titulo: "Conexión segura (HTTPS)", detalle: https ? "Sí" : "La web se sirve sin HTTPS", arreglo: "Activa un certificado SSL gratuito (Let's Encrypt) en tu hosting y redirige todo a https://." },
      { id: "noindex", ok: !noindex, grave: true, titulo: "Google puede indexar la página", detalle: noindex ? "Tiene la etiqueta noindex" : "Indexable", arreglo: "Quita <meta name=\"robots\" content=\"noindex\"> de la página." },
      { id: "title", ok: title.length >= 25 && title.length <= 65, grave: true, titulo: "Título de 25 a 65 caracteres", detalle: title ? `«${title}» (${title.length})` : "No tiene título", arreglo: "Escribe un título con tu palabra clave principal y tu marca, p. ej. «Servicio X en Ciudad | Marca»." },
      { id: "desc", ok: description.length >= 70 && description.length <= 160, grave: false, titulo: "Descripción de 70 a 160 caracteres", detalle: description ? `${description.length} caracteres` : "No tiene descripción", arreglo: `<meta name="description" content="Qué ofreces, a quién y por qué elegirte, con llamada a la acción.">` },
      { id: "h1", ok: h1.length === 1, grave: false, titulo: "Un único encabezado principal (H1)", detalle: h1.length ? `${h1.length}: ${h1.slice(0, 2).join(" · ")}` : "No tiene H1", arreglo: "Deja un solo <h1> con la palabra clave principal; el resto como <h2>/<h3>." },
      { id: "h2", ok: h2 >= 2, grave: false, titulo: "Estructura con subtítulos (H2)", detalle: `${h2} subtítulos`, arreglo: "Divide el contenido en secciones con <h2> que respondan a preguntas de tus clientes." },
      { id: "words", ok: palabras >= 300, grave: false, titulo: "Contenido suficiente (300+ palabras)", detalle: `${palabras} palabras`, arreglo: "Añade texto útil: servicios, preguntas frecuentes, zonas que atiendes y casos." },
      { id: "alt", ok: sinAlt === 0, grave: false, titulo: "Imágenes con texto alternativo", detalle: `${sinAlt} de ${imgs.length} sin alt`, arreglo: "Añade alt=\"descripción de la imagen\" a cada <img>." },
      { id: "viewport", ok: viewport, grave: true, titulo: "Adaptada a móvil", detalle: viewport ? "Sí" : "Falta la etiqueta viewport", arreglo: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" },
      { id: "canonical", ok: canonical, grave: false, titulo: "URL canónica", detalle: canonical ? "Sí" : "No definida", arreglo: `<link rel="canonical" href="${final}">` },
      { id: "lang", ok: !!lang, grave: false, titulo: "Idioma declarado", detalle: lang || "No declarado", arreglo: "<html lang=\"es\">" },
      { id: "og", ok: og, grave: false, titulo: "Vista previa para redes (Open Graph)", detalle: og ? "Sí" : "Falta og:title u og:image", arreglo: "<meta property=\"og:title\" content=\"...\"><meta property=\"og:image\" content=\"https://.../imagen.jpg\">" },
      { id: "schema", ok: schema, grave: false, titulo: "Datos estructurados (Schema.org)", detalle: schema ? "Sí" : "No tiene", arreglo: "Añade JSON-LD de tipo LocalBusiness u Organization con nombre, web y horario." },
      { id: "robots", ok: !!robots, grave: false, titulo: "Archivo robots.txt", detalle: robots ? "Encontrado" : "No encontrado", arreglo: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml` },
      { id: "sitemap", ok: sitemap || /sitemap/i.test(robots), grave: false, titulo: "Mapa del sitio (sitemap.xml)", detalle: sitemap ? "Encontrado" : "No encontrado", arreglo: "Genera un sitemap.xml (tu CMS o un plugin lo hace) y envíalo en Google Search Console." },
      { id: "speed", ok: ms < 1500, grave: false, titulo: "Respuesta rápida del servidor", detalle: `${ms} ms`, arreglo: "Activa caché, comprime imágenes (WebP) y usa un CDN como Cloudflare." },
      { id: "hsts", ok: hsts, grave: false, titulo: "Cabecera de seguridad HSTS", detalle: hsts ? "Sí" : "No", arreglo: "Strict-Transport-Security: max-age=31536000; includeSubDomains" },
    ];
    const peso = checks.reduce((s, c) => s + (c.grave ? 2 : 1), 0);
    const puntuacion = Math.round((checks.reduce((s, c) => s + (c.ok ? (c.grave ? 2 : 1) : 0), 0) / peso) * 100);
    return { url: data.url, final, estado: res.status, ms, puntuacion, checks, resumen: { title, description, h1, palabras, enlaces, imagenes: imgs.length } };
  });

export type KeywordIdea = { texto: string; busquedas: number; competencia: string; cpcMin: number | null; cpcMax: number | null };

export const keywordIdeas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string; idioma?: "es" | "en" | undefined }) => {
    const u = new URL(/^https?:\/\//i.test(input.url) ? input.url : "https://" + input.url);
    if (blocked(u.hostname)) throw new Error("Dirección no válida.");
    return { url: u.toString(), idioma: input.idioma === "en" ? "en" : "es" };
  })
  .handler(async ({ data }): Promise<KeywordIdea[]> => {
    const key = process.env["GOOGLE_ADS_API_KEY"]; const lov = process.env["LOVABLE_API_KEY"]; const cid = process.env["GOOGLE_ADS_CUSTOMER_ID"];
    if (!key || !lov || !cid) throw new Error("Google Ads no está conectado.");
    const res = await fetch(`https://connector-gateway.lovable.dev/google_ads/v25/customers/${cid}:generateKeywordIdeas`, {
      method: "POST",
      headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": key, "content-type": "application/json" },
      body: JSON.stringify({ language: data.idioma === "en" ? "languageConstants/1000" : "languageConstants/1003", geoTargetConstants: [data.idioma === "en" ? "geoTargetConstants/2826" : "geoTargetConstants/2724"], keywordPlanNetwork: "GOOGLE_SEARCH", urlSeed: { url: data.url }, pageSize: 40 }),
    });
    if (!res.ok) { const t = await res.text(); console.error(`Google Ads [${res.status}]: ${t}`); throw new Error(`Google Ads no pudo darnos ideas (${res.status}).`); }
    const j = (await res.json()) as { results?: { text: string; keywordIdeaMetrics?: { avgMonthlySearches?: string; competition?: string; lowTopOfPageBidMicros?: string; highTopOfPageBidMicros?: string } }[] };
    const comp: Record<string, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta" };
    const m = (v?: string) => (v ? Math.round(Number(v) / 10000) / 100 : null);
    return (j.results ?? []).map((r) => ({ texto: r.text, busquedas: Number(r.keywordIdeaMetrics?.avgMonthlySearches ?? 0), competencia: comp[r.keywordIdeaMetrics?.competition ?? ""] ?? "—", cpcMin: m(r.keywordIdeaMetrics?.lowTopOfPageBidMicros), cpcMax: m(r.keywordIdeaMetrics?.highTopOfPageBidMicros) }))
      .sort((a, b) => b.busquedas - a.busquedas).slice(0, 25);
  });
