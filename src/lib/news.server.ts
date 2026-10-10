import type {NewsArea, NewsResponse} from "./news.functions";
const cache = new Map<string, {at: number; result: NewsResponse}>();
const pending = new Map<string, Promise<NewsResponse>>();
const queries: Record<NewsArea, string> = {general: 'economy OR "business analytics" OR inflation', finanzas: 'inflation OR ECB OR IMF OR "economic outlook"', clientes: 'retail OR ecommerce OR "consumer spending"', operaciones: '"supply chain" OR manufacturing OR logistics', riesgo: '"AI regulation" OR cybersecurity OR "business risk"', seo: '"Google search" OR SEO OR "Google Analytics"', ia: 'OpenAI OR Anthropic OR Gemini'};
const decode = (value: string) => value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/<[^>]*>/g, "").trim();
const tag = (value: string, name: string) => decode(value.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "");
export async function readNews(area: NewsArea, language: "es" | "en"): Promise<NewsResponse> {
  const key = `${area}:${language}`;
  const stored = cache.get(key);
  if (stored && Date.now() - stored.at < 60 * 60_000) return stored.result;
  const active = pending.get(key);
  if (active) return active;
  const task = (async () => {
    const checkedAt = new Date().toISOString();
    try {
      const query = encodeURIComponent(`${queries[area]} when:7d`);
      const locale = language === "en" ? "hl=en-US&gl=US&ceid=US:en" : "hl=es&gl=ES&ceid=ES:es";
      const response = await fetch(`https://news.google.com/rss/search?q=${query}&${locale}`);
      if (!response.ok) throw new Error("Fuente de noticias temporalmente no disponible.");
      const xml = await response.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([,body = ""]) => {
        const date = new Date(tag(body, "pubDate"));
        return {title: tag(body,"title"), url: tag(body,"link"), source: tag(body,"source"), published: Number.isNaN(date.getTime()) ? null : date.toISOString()};
      }).filter(item => item.url.startsWith("https://") && item.title).slice(0, 12);
      const result = {items,checkedAt,error: null};
      cache.set(key, {at: Date.now(),result});
      return result;
    } catch {
      const result = {items: stored?.result.items ?? [], checkedAt: stored?.result.checkedAt ?? checkedAt, error: "No se pudo actualizar la fuente; las fechas de publicación indican la antigüedad real."};
      cache.set(key, {at: Date.now() - 55 * 60_000,result});
      return result;
    } finally {pending.delete(key);}
  })();
  pending.set(key, task);
  return task;
}