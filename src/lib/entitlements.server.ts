import type { SupabaseClient } from "@supabase/supabase-js";
import type { PaddleEnv } from "@/lib/paddle.server";

export type Tier = "basico" | "avanzado" | "total";
const rank: Record<Tier, number> = { basico: 1, avanzado: 2, total: 3 };
const LIVE_HOSTS = ["luminadatainsights.com", "www.luminadatainsights.com", "lumina-data-insghts-proyecto.lovable.app"];

/** Server-side environment: published domains are live, everything else (preview, localhost) is test. */
export function envFromRequest(request: Request): PaddleEnv {
  const host = new URL(request.url).hostname;
  const fwd = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  return LIVE_HOSTS.includes(fwd || host) ? "live" : "sandbox";
}

export async function getTier(supabase: SupabaseClient<any>, env: PaddleEnv): Promise<Tier | null> {
  const { data } = await supabase.rpc("my_plan", { p_env: env });
  return ((data as { tier?: Tier } | null)?.tier ?? null) as Tier | null;
}

export async function requireTier(supabase: SupabaseClient<any>, env: PaddleEnv, min: Tier) {
  const t = await getTier(supabase, env);
  if (!t) throw new Error("Empieza tus 3 días gratis en Suscripciones para usar esta función.");
  if (rank[t] < rank[min]) throw new Error("Esta función está incluida desde el plan Avanzado. Mejora tu plan en Suscripciones.");
  return t;
}
