import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server.ts";
export const modelIds = [
  "openai/gpt-6-astra",
  "anthropic/claude-sonnet-5",
  "google/gemini-3.8-flash",
] as const;
export async function gatewayModel(model: string, request: Request) {
  if (!modelIds.includes(model as (typeof modelIds)[number]))
    throw new Error("Modelo no admitido.");
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("La conexión de IA no está configurada.");
  const run = createLovableAiGatewayRunIdFetch(
    request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined,
  );
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: blocked, error: stateError } = await supabaseAdmin
    .from("ai_access_state")
    .select("blocked,reason")
    .eq("provider", model)
    .maybeSingle();
  if (stateError) throw new Error("No se pudo comprobar el acceso a IA.");
  if (blocked?.blocked)
    throw new Error(blocked.reason ?? "Acceso a IA pausado. Contacta con el administrador.");
  let failure: { status: number; message: string } | undefined;
  const checkedFetch: typeof fetch = async (input, init) => {
    const response = await run.fetch(input, init);
    if (!response.ok) {
      const body = (await response
        .clone()
        .json()
        .catch(() => null)) as {
        message?: string;
        error?: { message?: string };
        type?: string;
      } | null;
      failure = {
        status: response.status,
        message:
          body?.message ??
          body?.error?.message ??
          `El proveedor de IA respondió ${response.status}.`,
      };
      if (response.status === 402 || response.status === 403) {
        await supabaseAdmin
          .from("ai_access_state")
          .upsert({
            provider: model,
            blocked: true,
            reason: failure.message,
            updated_at: new Date().toISOString(),
          });
      }
    }
    return response;
  };
  const getFailure = () => failure;
  const headers = { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" };
  if (model.startsWith("openai/"))
    return {
      model: createOpenAI({
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey: key,
        headers,
        fetch: checkedFetch,
      }).responses(model),
      options: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "medium" as const,
          reasoningSummary: "auto" as const,
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
      run,
      getFailure,
    };
  if (model.startsWith("anthropic/"))
    return {
      model: createAnthropic({
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey: key,
        headers,
        fetch: checkedFetch,
      })(model),
      options: {},
      run,
      getFailure,
    };
  return {
    model: createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers,
      fetch: checkedFetch,
    })(model),
    options: {},
    run,
    getFailure,
  };
}
export async function authenticatedClient(request: Request) {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!key || !url || !token) throw new Error("Inicia sesión para continuar.");
  const client = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new Error("Inicia sesión para continuar.");
  return { client, user: data.user };
}
