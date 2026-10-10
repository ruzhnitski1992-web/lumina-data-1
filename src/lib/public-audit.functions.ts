import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export type AreaKey = "seguridad" | "velocidad" | "seo" | "correo" | "cookies";
export type AuditIssue = { area: AreaKey; titulo: string; explicacion: string; peso: number };
export type PublicAudit = {
  url: string;
  puntuacion: number;
  areas: { key: AreaKey; nombre: string; nota: number; detalle: string }[];
  problemas: AuditIssue[];
  restantes: number;
};

// Best-effort per-instance limit (3 per IP per day).
const hits = new Map<string, { day: string; n: number }>();

function blocked(host: string) {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const [a, b] = h.split(".").map(Number) as [number, number];
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
  }
  return h.startsWith("[") || h.includes(":");
}

const UA = { "user-agent": "LuminaAudit/1.0 (+https://luminadatainsights.com)" };
const get = (url: string, ms = 12000) => fetch(url, { redirect: "follow", headers: UA, signal: AbortSignal.timeout(ms) });

async function txt(name: string): Promise<string[]> {
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) });
    const j = (await r.json()) as { Answer?: { data: string }[] };
    return (j.Answer ?? []).map((a) => a.data.replace(/"\s*"/g, "").replace(/"/g, ""));
  } catch { return []; }
}

const KNOWN_TRACKERS = /googletagmanager|google-analytics|connect\.facebook|hotjar|clarity\.ms|doubleclick|tiktok|linkedin\.com\/insight|snap\.licdn/i;
const CMP = /cookiebot|onetrust|cookieyes|iubenda|complianz|usercentrics|didomi|cookie-?consent|klaro/i;

export const publicAudit = createServerFn({ method: "POST" })
  .inputValidator((input: { url: string }) => {
    let raw = String(input?.url ?? "").trim().slice(0, 300);
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    let u: URL;
    try { u = new URL(raw); } catch { throw new Error("Escribe una dirección web válida (por ejemplo, tuempresa.com)."); }
    if (!/^https?:$/.test(u.protocol) || blocked(u.hostname)) throw new Error("Escribe la dirección pública de una web (por ejemplo, tuempresa.com).");
    return { url: u.origin + u.pathname };
  })
  .handler(async ({ data }): Promise<PublicAudit> => {
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
    const day = new Date().toISOString().slice(0, 10);
    const rec = hits.get(ip);
    const n = rec && rec.day === day ? rec.n : 0;
    if (n >= 3) throw new Error("Has alcanzado el límite de 3 auditorías gratuitas por día. Vuelve mañana o activa un plan.");
    hits.set(ip, { day, n: n + 1 });
    if (hits.size > 5000) hits.clear();

    const t0 = Date.now();
    let res: Response;
    try { res = await get(data.url); } catch { throw new Error("No he podido abrir esa web. Comprueba que la dirección es correcta y está publicada."); }
    const ms = Date.now() - t0;
    const final = new URL(res.url || data.url);
    if (blocked(final.hostname)) throw new Error("La web redirige a una dirección no pública.");
    const html = (await res.text()).slice(0, 1_500_000);
    const domain = final.hostname.replace(/^www\./, "");

    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(final.toString())}&strategy=mobile&category=performance`;
    const [robots, sitemapOk, spf, dmarc, dkim, psi] = await Promise.all([
      get(final.origin + "/robots.txt", 6000).then(async (r) => (r.ok ? await r.text() : "")).catch(() => ""),
      get(final.origin + "/sitemap.xml", 6000).then((r) => r.ok).catch(() => false),
      txt(domain).then((a) => a.find((t) => /^v=spf1/i.test(t)) ?? ""),
      txt("_dmarc." + domain).then((a) => a.find((t) => /^v=dmarc1/i.test(t)) ?? ""),
      Promise.all(["google", "selector1", "default", "k1", "s1", "mail"].map((s) => txt(`${s}._domainkey.${domain}`))).then((r) => r.some((a) => a.some((t) => /v=dkim1|p=/i.test(t)))),
      get(psiUrl, 45000).then(async (r) => (r.ok ? ((await r.json()) as any) : null)).catch(() => null),
    ]);

    const issues: AuditIssue[] = [];
    const add = (area: AreaKey, titulo: string, explicacion: string, peso: number) => issues.push({ area, titulo, explicacion, peso });

    // Seguridad
    let seg = 100;
    const https = final.protocol === "https:";
    if (!https) { seg -= 50; add("seguridad", "La web no usa conexión segura (HTTPS)", "Los navegadores la marcan como «No segura» y los datos que escriben tus clientes viajan sin cifrar. Activa un certificado SSL gratuito en tu hosting.", 10); }
    const h = (k: string) => !!res.headers.get(k);
    const faltan = [["strict-transport-security", "HSTS"], ["content-security-policy", "CSP"], ["x-content-type-options", "X-Content-Type-Options"], ["x-frame-options", "X-Frame-Options"], ["referrer-policy", "Referrer-Policy"]].filter(([k]) => !h(k!) && !(k === "x-frame-options" && /frame-ancestors/i.test(res.headers.get("content-security-policy") ?? "")));
    seg -= faltan.length * 10;
    if (faltan.length >= 3) add("seguridad", `Faltan ${faltan.length} cabeceras de seguridad`, `No se envían: ${faltan.map((f) => f[1]).join(", ")}. Son instrucciones que protegen frente a ataques comunes; tu proveedor de hosting o Cloudflare las añade en minutos.`, 5);

    // Velocidad
    let vel: number;
    let velDet: string;
    const perf = psi?.lighthouseResult?.categories?.performance?.score;
    if (typeof perf === "number") {
      vel = Math.round(perf * 100);
      const lcp = psi.lighthouseResult.audits?.["largest-contentful-paint"]?.displayValue ?? "";
      const cls = psi.lighthouseResult.audits?.["cumulative-layout-shift"]?.displayValue ?? "";
      velDet = `PageSpeed móvil ${vel}/100 · LCP ${lcp} · CLS ${cls}`;
      if (vel < 50) add("velocidad", "La web es lenta en el móvil", `Google le da ${vel}/100 en móvil (contenido principal en ${lcp}). Más de la mitad de las visitas abandonan si tarda más de 3 segundos. Comprime imágenes (WebP) y reduce scripts.`, 8);
      else if (vel < 80) add("velocidad", "La velocidad en el móvil es mejorable", `Google le da ${vel}/100 en móvil. Optimizar imágenes y la caché suele subirla por encima de 80.`, 4);
    } else {
      vel = ms < 800 ? 85 : ms < 1500 ? 65 : ms < 3000 ? 40 : 20;
      velDet = `Respuesta del servidor en ${ms} ms (PageSpeed no respondió a tiempo)`;
      if (vel < 50) add("velocidad", "El servidor tarda en responder", `Ha tardado ${ms} ms solo en empezar a enviar la página. Activa caché o un CDN.`, 6);
    }

    // SEO
    let seo = 100;
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
    const desc = /<meta[^>]+name=["']description["'][^>]*content=["'][^"']{50,}/i.test(html) || /<meta[^>]+content=["'][^"']{50,}["'][^>]*name=["']description["']/i.test(html);
    const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
    const noindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);
    if (noindex) { seo -= 40; add("seo", "Google tiene prohibido mostrar esta página", "Lleva la etiqueta «noindex»: no aparecerá en los resultados de búsqueda aunque todo lo demás esté bien.", 10); }
    if (title.length < 15 || title.length > 70) { seo -= 15; add("seo", title ? "El título de la página no es el adecuado" : "La página no tiene título", "El título es lo primero que ve la gente en Google. Debe tener 30–65 caracteres con tu servicio principal y tu ciudad o marca.", 6); }
    if (!desc) { seo -= 10; add("seo", "Falta la descripción para Google", "Sin ella, Google improvisa un texto. Una buena descripción (70–160 caracteres) aumenta los clics.", 4); }
    if (h1 !== 1) { seo -= 10; add("seo", h1 ? "Hay varios títulos principales (H1)" : "No hay título principal (H1)", "Cada página debe tener un único encabezado principal con la palabra clave.", 3); }
    if (!sitemapOk && !/sitemap/i.test(robots)) { seo -= 10; add("seo", "No hay mapa del sitio (sitemap)", "El sitemap ayuda a Google a descubrir todas tus páginas. La mayoría de gestores web lo crean con un clic.", 3); }
    if (!robots) seo -= 5;

    // Correo
    let mail = 100;
    const dmarcPol = dmarc.match(/p=(\w+)/i)?.[1]?.toLowerCase() ?? "";
    if (!spf) mail -= 35;
    if (!dmarc) mail -= 40; else if (dmarcPol === "none") mail -= 20;
    if (!dkim) mail -= 15;
    if (!spf || !dmarc) add("correo", "Cualquiera podría enviar correos haciéndose pasar por tu empresa", `${!spf ? "No hay registro SPF. " : ""}${!dmarc ? "No hay política DMARC. " : ""}Así se hacen los fraudes de facturas falsas. Tu proveedor de correo te da los registros para añadirlos a tu dominio.`, 9);
    else if (dmarcPol === "none") add("correo", "Tu protección contra suplantación solo vigila, no bloquea", "DMARC está en modo «p=none»: detecta correos falsos pero no los frena. Cámbialo a «quarantine» cuando revises los informes.", 4);

    // Cookies
    let ck = 100;
    const scripts = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)].map((m) => m[1]!);
    const inline = /gtag\(|fbq\(|_hjSettings|clarity\(/i.test(html);
    const trackers = [...new Set(scripts.filter((s) => KNOWN_TRACKERS.test(s)).map((s) => { try { return new URL(s, final).hostname; } catch { return s; } }))];
    const cmp = CMP.test(html);
    if ((trackers.length || inline) && !cmp) { ck = 30; add("cookies", "Se cargan rastreadores antes de pedir permiso", `Hemos visto ${trackers.length ? trackers.join(", ") : "código de analítica"} en la página sin un gestor de consentimiento reconocible. Es un indicio técnico de posible incumplimiento del RGPD, que la AEPD sanciona.`, 7); }
    else if (trackers.length || inline) ck = 75;

    const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
    const areas = [
      { key: "seguridad" as const, nombre: "Seguridad básica", nota: clamp(seg), detalle: https ? `HTTPS activo · ${5 - faltan.length}/5 cabeceras` : "Sin HTTPS" },
      { key: "velocidad" as const, nombre: "Velocidad", nota: clamp(vel), detalle: velDet },
      { key: "seo" as const, nombre: "SEO visible", nota: clamp(seo), detalle: `Título ${title.length} car. · ${h1} H1 · sitemap ${sitemapOk ? "sí" : "no"} · robots ${robots ? "sí" : "no"}` },
      { key: "correo" as const, nombre: "Correo (suplantación)", nota: clamp(mail), detalle: `SPF ${spf ? "sí" : "no"} · DKIM ${dkim ? "sí" : "no detectado"} · DMARC ${dmarc ? dmarcPol || "sí" : "no"}` },
      { key: "cookies" as const, nombre: "Cookies", nota: clamp(ck), detalle: trackers.length || inline ? `Rastreadores: ${trackers.join(", ") || "en línea"} · gestor ${cmp ? "detectado" : "no detectado"}` : "Sin rastreadores conocidos en la carga inicial" },
    ];
    const puntuacion = clamp(areas.reduce((s, a) => s + a.nota, 0) / areas.length);
    return { url: final.toString(), puntuacion, areas, problemas: issues.sort((a, b) => b.peso - a.peso).slice(0, 3), restantes: 2 - n };
  });
