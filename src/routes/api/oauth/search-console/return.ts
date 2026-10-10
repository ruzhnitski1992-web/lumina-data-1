import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/oauth/search-console/return")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const connectorId = url.searchParams.get("connector_id") ?? "";
        const code = url.searchParams.get("code") ?? "";
        const success = url.searchParams.get("success") === "true";
        const offline = url.searchParams.get("offline_access_allowed");
        const error = url.searchParams.get("error");
        const result = success && offline === "false" ? { success: true, connectorId, code: null }
          : success && code ? { success: true, connectorId, code }
          : { success: false, connectorId, error: error ?? (success ? "Missing code" : "OAuth failed") };
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const safe = JSON.stringify(result).replace(/<\//g, "<\\/");
        const html = `<!DOCTYPE html><html><head><title>Conectando…</title></head><body><p>${result.success ? "Conexión completada, cerrando…" : "Error: " + esc(String((result as { error?: string }).error ?? ""))}</p><script>const r=${safe};const m={type:r.success?"appUserConnectorOAuthComplete":"appUserConnectorOAuthFailed",connectorId:r.connectorId,code:r.code??null};if(window.opener&&window.opener!==window){window.opener.postMessage(m,window.location.origin);}window.close();</script></body></html>`;
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      },
    },
  },
});
