import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/auth")({
  head: () =>
    pageHead("Accede a tu cuenta", "Acceso privado a tus conversaciones e informes de Lumina IA."),
  component: Auth,
});
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-md px-5 pt-36 pb-24">
      <h1 className="text-3xl font-extrabold">{signup ? "Crea tu cuenta" : "Accede a Lumina"}</h1>
      <p className="mt-3 text-lp-muted">
        Conversaciones e informes privados. Una prueba gratuita por cuenta.
      </p>
      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMsg("");
          try {
            const { error } = signup
              ? await supabase.auth.signUp({
                  email,
                  password,
                  options: { emailRedirectTo: window.location.origin + "/app" },
                })
              : await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (signup) setMsg("Revisa tu correo para confirmar la cuenta.");
            else await navigate({ to: "/app" });
          } catch (err) {
            setMsg(err instanceof Error ? err.message : "No se pudo acceder.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm font-semibold">
          Email
          <input
            className="mt-2 w-full rounded-md border border-lp-line p-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input
            className="mt-2 w-full rounded-md border border-lp-line p-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            autoComplete={signup ? "new-password" : "current-password"}
          />
        </label>
        <Button type="submit" className="h-11 w-full" disabled={busy}>
          {busy ? "Conectando…" : signup ? "Crear cuenta" : "Iniciar sesión"}
        </Button>
      </form>
      <Button
        variant="outline"
        className="mt-4 h-11 w-full"
        onClick={async () => {
          const r = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });
          if (r.error) setMsg(r.error.message);
          else if (!r.redirected) await navigate({ to: "/app" });
        }}
      >
        Continuar con Google
      </Button>
      {msg && (
        <p role="status" className="mt-4 text-sm">
          {msg}
        </p>
      )}
      <Button variant="link" className="mt-4" onClick={() => setSignup(!signup)}>
        {signup ? "Ya tengo cuenta" : "Crear una cuenta"}
      </Button>
      <p className="mt-5 text-xs text-lp-muted">
        Al continuar, consulta la{" "}
        <a href="/privacidad" className="text-lp-blue underline">
          política de privacidad
        </a>{" "}
        y las{" "}
        <a href="/condiciones" className="text-lp-blue underline">
          condiciones
        </a>
        .
      </p>
    </main>
  );
}
