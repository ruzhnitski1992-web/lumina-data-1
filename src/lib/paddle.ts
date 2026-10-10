import { resolvePaddlePrice } from "@/lib/payments.functions";

const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"] as string | undefined;

declare global {
  interface Window {
    Paddle: any;
  }
}

export function getPaddleEnvironment(): "sandbox" | "live" {
  return clientToken?.startsWith("test_") ? "sandbox" : "live";
}

let ready: Promise<void> | null = null;
export function initializePaddle() {
  if (ready) return ready;
  if (!clientToken) return Promise.reject(new Error("Pagos no configurados"));
  ready = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.onload = () => {
      window.Paddle.Environment.set(getPaddleEnvironment() === "sandbox" ? "sandbox" : "production");
      window.Paddle.Initialize({ token: clientToken });
      resolve();
    };
    s.onerror = () => {
      ready = null;
      reject(new Error("No se pudo cargar el pago"));
    };
    document.head.appendChild(s);
  });
  return ready;
}

export async function openCheckout(priceId: string, user: { id: string; email?: string | undefined }) {
  await initializePaddle();
  const id = await resolvePaddlePrice({ data: { priceId, environment: getPaddleEnvironment() } });
  window.Paddle.Checkout.open({
    items: [{ priceId: id, quantity: 1 }],
    customer: user.email ? { email: user.email } : undefined,
    customData: { userId: user.id },
    settings: {
      displayMode: "overlay",
      locale: "es",
      successUrl: `${window.location.origin}/suscripciones?pago=ok`,
      allowLogout: false,
      variant: "one-page",
    },
  });
}
