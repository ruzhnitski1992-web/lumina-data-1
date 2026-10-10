import { createServerFn } from "@tanstack/react-start";

export type WebResult = { title: string; url: string; snippet: string; date: string | null };

export const webSearch = createServerFn({ method: "POST" })
  .inputValidator((d: { query: string }) => {
    const query = (d.query ?? "").trim();
    if (query.length < 3 || query.length > 300) throw new Error("Escribe una búsqueda de 3 a 300 caracteres.");
    return { query };
  })
  .handler(async ({ data }): Promise<{ results: WebResult[]; fetchedAt: string; error: string | null }> => {
    const fetchedAt = new Date().toISOString();
    const lk = process.env['LOVABLE_API_KEY'], pk = process.env['PERPLEXITY_API_KEY'];
    if (!lk || !pk) return { results: [], fetchedAt, error: "El buscador no está configurado." };
    const res = await fetch("https://connector-gateway.lovable.dev/perplexity/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${lk}`, "X-Connection-Api-Key": pk, "Content-Type": "application/json" },
      body: JSON.stringify({ query: data.query, max_results: 8, search_recency_filter: "month" }),
    });
    if (!res.ok) {
      console.error("Perplexity search failed", res.status, await res.text());
      return { results: [], fetchedAt, error: res.status === 402 ? "Sin créditos disponibles para buscar." : `La búsqueda falló (${res.status}).` };
    }
    const json = (await res.json()) as { results?: { title?: string; url?: string; snippet?: string; date?: string }[] };
    const results = (json.results ?? []).map((r) => ({ title: r.title ?? r.url ?? "", url: r.url ?? "", snippet: (r.snippet ?? "").slice(0, 280), date: r.date ?? null }));
    return { results, fetchedAt, error: null };
  });
