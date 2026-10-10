// Server-only: fetches official sources and stores them. Writes use the admin client (tables are read-only for visitors).
const decode = (s: string) =>
  s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
const tag = (b: string, n: string) => decode(b.match(new RegExp(`<${n}[^>]*>([\\s\\S]*?)</${n}>`))?.[1] ?? "");

export const ARXIV_SOURCES: Record<string, string[]> = {
  "arxiv-ai": ["cs.AI", "cs.CL", "cs.LG", "cs.CV", "stat.ML"],
  "arxiv-ro": ["cs.RO"],
};

const admin = async () => (await import("@/integrations/supabase/client.server")).supabaseAdmin;

export function isStale(last: string | null, minutes: number) {
  return !last || Date.now() - new Date(last).getTime() > minutes * 60_000;
}

export async function syncArxiv(sourceId: string) {
  const db = await admin();
  const cats = ARXIV_SOURCES[sourceId];
  if (!cats) return;
  try {
    const q = cats.map((c) => `cat:${c}`).join("+OR+");
    const res = await fetch(`https://export.arxiv.org/api/query?search_query=${q}&sortBy=submittedDate&sortOrder=descending&max_results=40`, {
      headers: { "User-Agent": "LuminaDataInsights-Observatorio/1.0 (atteencliente.022@gmail.com)" },
    });
    if (!res.ok) throw new Error(`arXiv respondió ${res.status}`);
    const xml = await res.text();
    const rows = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, b = ""]) => {
      const first = tag(b, "summary").split(/(?<=\.)\s/).slice(0, 2).join(" ");
      const authors = [...b.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => decode(m[1] ?? ""));
      const id = tag(b, "id");
      return {
        id, source_id: sourceId, url: id, title: tag(b, "title"),
        summary: first.length > 320 ? first.slice(0, 317) + "…" : first,
        authors: authors.slice(0, 3).join(", ") + (authors.length > 3 ? " et al." : ""),
        category: b.match(/<arxiv:primary_category[^>]*term="([^"]+)"/)?.[1] ?? "",
        published_at: tag(b, "published") || null,
      };
    }).filter((r) => r.id);
    if (rows.length) {
      const { error } = await db.from("external_items").upsert(rows, { onConflict: "id" });
      if (error) throw new Error(error.message);
    }
    const { count } = await db.from("external_items").select("id", { count: "exact", head: true }).eq("source_id", sourceId);
    await db.from("sources").update({ last_synced_at: new Date().toISOString(), status: "ok", last_error: null, item_count: count ?? rows.length }).eq("id", sourceId);
  } catch (e) {
    console.error("syncArxiv", sourceId, e);
    await db.from("sources").update({ last_synced_at: new Date().toISOString(), status: "error", last_error: (e as Error).message }).eq("id", sourceId);
  }
}

export async function syncWorldBank(indicator: string, countries: string[]) {
  const db = await admin();
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/${countries.join(";")}/indicator/${indicator}?format=json&per_page=1000&date=2010:2026`);
    if (!res.ok) throw new Error(`Banco Mundial respondió ${res.status}`);
    const json = (await res.json()) as [unknown, { countryiso3code: string; date: string; value: number | null }[] | null];
    const now = new Date().toISOString();
    const rows = (json[1] ?? []).filter((r) => r.countryiso3code).map((r) => ({ indicator, country: r.countryiso3code, year: r.date, value: r.value, source_id: "worldbank", updated_at: now }));
    if (rows.length) {
      const { error } = await db.from("indicator_values").upsert(rows, { onConflict: "indicator,country,year" });
      if (error) throw new Error(error.message);
    }
    const { count } = await db.from("indicator_values").select("year", { count: "exact", head: true });
    await db.from("sources").update({ last_synced_at: now, status: "ok", last_error: null, item_count: count ?? 0 }).eq("id", "worldbank");
  } catch (e) {
    console.error("syncWorldBank", indicator, e);
    await db.from("sources").update({ status: "error", last_error: (e as Error).message }).eq("id", "worldbank");
  }
}
