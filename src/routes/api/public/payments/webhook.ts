import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, EventName, type PaddleEnv } from "@/lib/paddle.server";

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function handle(req: Request, env: PaddleEnv) {
  const event: any = await verifyWebhook(req, env);
  const d = event.data;
  const sb = await db();
  if (event.eventType === EventName.SubscriptionCreated) {
    const userId = d.customData?.userId;
    const item = d.items?.[0];
    const priceId = item?.price?.importMeta?.externalId;
    const productId = item?.product?.importMeta?.externalId;
    if (!userId || !priceId || !productId) {
      console.warn("Skipping subscription: missing userId or importMeta.externalId");
      return;
    }
    await sb.from("subscriptions").upsert(
      {
        user_id: userId,
        paddle_subscription_id: d.id,
        paddle_customer_id: d.customerId,
        product_id: productId,
        price_id: priceId,
        status: d.status,
        current_period_start: d.currentBillingPeriod?.startsAt,
        current_period_end: d.currentBillingPeriod?.endsAt,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "paddle_subscription_id" },
    );
  } else if (event.eventType === EventName.SubscriptionUpdated) {
    await sb
      .from("subscriptions")
      .update({
        status: d.status,
        price_id: d.items?.[0]?.price?.importMeta?.externalId ?? undefined,
        current_period_start: d.currentBillingPeriod?.startsAt,
        current_period_end: d.currentBillingPeriod?.endsAt,
        cancel_at_period_end: d.scheduledChange?.action === "cancel",
        updated_at: new Date().toISOString(),
      })
      .eq("paddle_subscription_id", d.id)
      .eq("environment", env);
  } else if (event.eventType === EventName.SubscriptionCanceled) {
    await sb
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("paddle_subscription_id", d.id)
      .eq("environment", env);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = (new URL(request.url).searchParams.get("env") === "live" ? "live" : "sandbox") as PaddleEnv;
        try {
          await handle(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
