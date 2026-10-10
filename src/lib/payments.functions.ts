import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { gatewayFetch, getPaddleClient, type PaddleEnv } from "@/lib/paddle.server";

const ALLOWED = ["lumina_monthly", "lumina_quarterly", "lumina_yearly"];
const normEnv = (e: unknown): PaddleEnv => (e === "live" ? "live" : "sandbox");

async function resolve(env: PaddleEnv, priceId: string) {
  const r = await gatewayFetch(env, `/prices?external_id=${encodeURIComponent(priceId)}`);
  const j = await r.json();
  if (!j.data?.length) throw new Error("Precio no encontrado");
  return j.data[0].id as string;
}

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((d: { priceId: string; environment: PaddleEnv }) => {
    if (!ALLOWED.includes(d.priceId)) throw new Error("Plan no válido");
    return { priceId: d.priceId, environment: normEnv(d.environment) };
  })
  .handler(async ({ data }) => resolve(data.environment, data.priceId));

async function latestSub(context: any, env: PaddleEnv) {
  const { data: sub } = await context.supabase
    .from("subscriptions")
    .select("paddle_customer_id, paddle_subscription_id, price_id, status")
    .eq("user_id", context.userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return sub as { paddle_customer_id: string; paddle_subscription_id: string; price_id: string; status: string } | null;
}

export const openCustomerPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { environment: PaddleEnv }) => ({ environment: normEnv(d.environment) }))
  .handler(async ({ data, context }) => {
    const sub = await latestSub(context, data.environment);
    if (!sub) throw new Error("No tienes ninguna suscripción");
    const s = await getPaddleClient(data.environment).customerPortalSessions.create(sub.paddle_customer_id, [
      sub.paddle_subscription_id,
    ]);
    return s.urls.general.overview;
  });

/** Switch the current subscription to another plan; Paddle prorates the difference immediately. */
export const changePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { priceId: string; environment: PaddleEnv }) => {
    if (!ALLOWED.includes(d.priceId)) throw new Error("Plan no válido");
    return { priceId: d.priceId, environment: normEnv(d.environment) };
  })
  .handler(async ({ data, context }) => {
    getRequest();
    const sub = await latestSub(context, data.environment);
    if (!sub || !["active", "trialing", "past_due"].includes(sub.status))
      throw new Error("No tienes una suscripción activa que cambiar.");
    if (sub.price_id === data.priceId) return { ok: true };
    const paddlePrice = await resolve(data.environment, data.priceId);
    const r = await gatewayFetch(data.environment, `/subscriptions/${sub.paddle_subscription_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        items: [{ price_id: paddlePrice, quantity: 1 }],
        proration_billing_mode: sub.status === "trialing" ? "do_not_bill" : "prorated_immediately",
      }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      console.error("changePlan failed", j);
      throw new Error(j?.error?.detail || "No se pudo cambiar de plan. Inténtalo de nuevo.");
    }
    // Optimistic local update; the webhook confirms it.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("subscriptions")
      .update({ price_id: data.priceId, updated_at: new Date().toISOString() })
      .eq("paddle_subscription_id", sub.paddle_subscription_id)
      .eq("environment", data.environment);
    return { ok: true };
  });
