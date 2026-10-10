import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { getPaddleEnvironment, openCheckout } from "@/lib/paddle";
import { openCustomerPortal } from "@/lib/payments.functions";

type Sub = { price_id: string; status: string; current_period_end: string | null } | null;

export function useMySubscription() {
  const [user, setUser] = useState<{ id: string; email?: string | undefined; confirmed: boolean } | null>(null);
  const [sub, setSub] = useState<Sub>(null);
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUser(u ? { id: u.id, email: u.email, confirmed: !!u.email_confirmed_at } : null);
      if (!u) return setSub(null);
      const { data: s } = await supabase
        .from("subscriptions")
        .select("price_id,status,current_period_end")
        .eq("user_id", u.id)
        .eq("environment", getPaddleEnvironment())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const active =
        s &&
        (["active", "trialing", "past_due"].includes(s.status) ||
          (s.status === "canceled" && s.current_period_end && new Date(s.current_period_end) > new Date()));
      setSub(active ? s : null);
    };
    load();
    const { data: l } = supabase.auth.onAuthStateChange(() => load());
    return () => l.subscription.unsubscribe();
  }, []);
  return { user, sub };
}

export function SubscribeButton({ priceId, user, sub }: { priceId: string } & ReturnType<typeof useMySubscription>) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (!user)
    return (
      <Button asChild className="mt-7 w-full">
        <a href="/auth">Crea tu cuenta · 3 días gratis</a>
      </Button>
    );
  if (!user.confirmed)
    return <p className="mt-7 text-sm text-lp-muted">Confirma tu correo (revisa tu bandeja) para poder suscribirte.</p>;
  if (sub) {
    const mine = sub.price_id === priceId;
    return (
      <Button
        variant={mine ? "default" : "outline"}
        className="mt-7 w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const url = await openCustomerPortal({ data: { environment: getPaddleEnvironment() } });
            window.open(url, "_blank");
          } catch (e) {
            setErr((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {mine ? "Tu plan actual · gestionar" : "Cambiar de plan"}
      </Button>
    );
  }
  return (
    <>
      <Button
        className="mt-7 w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr("");
          try {
            await openCheckout(priceId, user);
          } catch (e) {
            setErr((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Abriendo pago…" : "Empezar 3 días gratis"}
      </Button>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
    </>
  );
}

export function PaymentTestModeBanner() {
  if (getPaddleEnvironment() !== "sandbox") return null;
  return (
    <div className="w-full border-b border-lp-line bg-secondary px-4 py-2 text-center text-sm">
      Pagos en modo prueba: no se cobra dinero real.
    </div>
  );
}
