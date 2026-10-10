import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type RadarItem = { id: string; title: string; summary: string; url: string; published: string; authors: string; category: string };
export type SourceStatus = { name: string; lastSynced: string | null; status: string; itemCount: number; lastError: string | null };

function publicDb() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_")) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
  });
}

const toStatus = (s: Database["public"]["Tables"]["sources"]["Row"]): SourceStatus => ({ name: s.name, lastSynced: s.last_synced_at, status: s.status, itemCount: s.item_count, lastError: s.last_error });

export const getRadar = createServerFn({ method: "GET" })
  .inputValidator((d: { source: "arxiv-ai" | "arxiv-ro" }) => {
    if (d.source !== "arxiv-ai" && d.source !== "arxiv-ro") throw new Error("Fuente no válida");
    return d;
  })
  .handler(async ({ data }): Promise<{ items: RadarItem[]; source: SourceStatus | null; error: string | null }> => {
    const db = publicDb();
    const { syncArxiv, isStale } = await import("./observatory.server");
    let { data: src } = await db.from("sources").select("*").eq("id", data.source).maybeSingle();
    if (src && isStale(src.last_synced_at, src.status === "error" ? 10 : src.refresh_minutes)) {
      await syncArxiv(data.source);
      src = (await db.from("sources").select("*").eq("id", data.source).maybeSingle()).data;
    }
    const { data: rows, error } = await db.from("external_items").select("*").eq("source_id", data.source).order("published_at", { ascending: false }).limit(20);
    if (error) return { items: [], source: src ? toStatus(src) : null, error: "No se pudieron leer las novedades guardadas" };
    return {
      items: (rows ?? []).map((r) => ({ id: r.id, title: r.title, summary: r.summary, url: r.url, published: r.published_at ?? r.captured_at, authors: r.authors, category: r.category })),
      source: src ? toStatus(src) : null,
      error: !rows?.length && src?.last_error ? src.last_error : null,
    };
  });

export const INDICATORS = {
  "NY.GDP.MKTP.KD.ZG": "Crecimiento del PIB (% anual)",
  "FP.CPI.TOTL.ZG": "Inflación, precios al consumo (% anual)",
  "SL.UEM.TOTL.ZS": "Desempleo (% población activa)",
  "GB.XPD.RSDV.GD.ZS": "Gasto en I+D (% del PIB)",
  "NE.EXP.GNFS.ZS": "Exportaciones (% del PIB)",
  "IT.NET.USER.ZS": "Usuarios de Internet (% población)",
} as const;
export const COUNTRIES = { ESP: "España", FRA: "Francia", DEU: "Alemania", ITA: "Italia", PRT: "Portugal", USA: "EE. UU.", CHN: "China", GBR: "Reino Unido", EUU: "Unión Europea" } as const;

export type WorldSeries = { country: string; points: { year: string; value: number | null }[] };

export const getWorldBank = createServerFn({ method: "GET" })
  .inputValidator((d: { indicator: string; countries: string[] }) => {
    if (!(d.indicator in INDICATORS)) throw new Error("Indicador no válido");
    const countries = d.countries.filter((c) => c in COUNTRIES).slice(0, 6);
    if (!countries.length) throw new Error("Selecciona al menos un país");
    return { indicator: d.indicator, countries };
  })
  .handler(async ({ data }): Promise<{ series: WorldSeries[]; lastUpdated: string; source: string; status: SourceStatus | null; error: string | null }> => {
    const source = `https://data.worldbank.org/indicator/${data.indicator}`;
    const db = publicDb();
    const { syncWorldBank, isStale } = await import("./observatory.server");
    const latest = await db.from("indicator_values").select("updated_at").eq("indicator", data.indicator).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (isStale(latest.data?.updated_at ?? null, 1440)) await syncWorldBank(data.indicator, Object.keys(COUNTRIES));
    const [{ data: rows, error }, { data: src }] = await Promise.all([
      db.from("indicator_values").select("country,year,value,updated_at").eq("indicator", data.indicator).in("country", data.countries).order("year"),
      db.from("sources").select("*").eq("id", "worldbank").maybeSingle(),
    ]);
    if (error) return { series: [], lastUpdated: "", source, status: null, error: "No se pudieron leer los datos guardados" };
    const series = data.countries.map((c) => ({ country: c, points: (rows ?? []).filter((r) => r.country === c).map((r) => ({ year: r.year, value: r.value })) }));
    const lastUpdated = (rows ?? []).reduce((m, r) => (r.updated_at > m ? r.updated_at : m), "");
    return { series, lastUpdated, source, status: src ? toStatus(src) : null, error: !rows?.length ? (src?.last_error ?? "Sin datos disponibles") : null };
  });
