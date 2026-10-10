import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GW = "https://connector-gateway.lovable.dev";
const CID = "google_search_console";
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/webmasters",
];

async function call(userId: string, path: string, init?: RequestInit) {
  const { getConnectionKeyForUser } = await import("@/server/appUserConnections.server");
  const { callAsAppUser, appUserReconnectRequired } = await import("@/integrations/lovable/appUserConnector");
  const k = await getConnectionKeyForUser(userId, CID);
  if (!k) return { state: "disconnected" as const };
  const res = await callAsAppUser({ gatewayBaseUrl: GW, connectionAPIKey: k, connectorId: CID, path, init, requiredScopes: SCOPES });
  if (await appUserReconnectRequired(res)) return { state: "reconnect" as const };
  if (res.status === 403) throw new Error("Tu cuenta de Google no tiene acceso a esa propiedad de Search Console.");
  if (!res.ok) { const t = await res.text(); console.error(`Search Console [${res.status}]: ${t}`); throw new Error(`Search Console respondió ${res.status}.`); }
  const text = await res.text();
  return { state: "ok" as const, json: text ? JSON.parse(text) : {} };
}

export const startSearchConsoleConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const clientKey = process.env["GOOGLE_SEARCH_CONSOLE_APP_USER_CONNECTOR_CLIENT_API_KEY"];
    if (!clientKey) throw new Error("Search Console no está configurado.");
    const { authorizeAppUserOAuth } = await import("@/integrations/lovable/appUserConnector");
    const { getConnectionKeyForUser } = await import("@/server/appUserConnections.server");
    const request = getRequest();
    const url = new URL(request.url);
    const sandboxHost = url.hostname === "localhost" ? request.headers.get("x-forwarded-host") : null;
    const returnUrl = new URL("/api/oauth/search-console/return", sandboxHost ? `https://${sandboxHost}` : url.origin).toString();
    const existing = await getConnectionKeyForUser(context.userId, CID);
    const { authorizationUrl } = await authorizeAppUserOAuth({
      gatewayBaseUrl: GW, connectorId: CID, appUserId: context.userId, clientAPIKey: clientKey, returnUrl,
      connectionAPIKey: existing ?? undefined, credentialsConfiguration: { scopes: SCOPES },
    });
    return { authorizationUrl };
  });

export const completeSearchConsoleConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { code: string }) => ({ code: String(i.code).slice(0, 500) }))
  .handler(async ({ data, context }) => {
    const { exchangeAppUserOAuthCode } = await import("@/integrations/lovable/appUserConnector");
    const { saveConnectionKeyForUser } = await import("@/server/appUserConnections.server");
    const { connectionAPIKey, connectorId } = await exchangeAppUserOAuthCode(GW, data.code);
    if (connectorId !== CID) throw new Error("Conexión incorrecta.");
    await saveConnectionKeyForUser(context.userId, connectorId, connectionAPIKey);
    return { ok: true };
  });

export const disconnectSearchConsole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getConnectionKeyForUser, deleteConnectionKeyForUser } = await import("@/server/appUserConnections.server");
    const { disconnectAppUser } = await import("@/integrations/lovable/appUserConnector");
    const k = await getConnectionKeyForUser(context.userId, CID);
    if (k) await disconnectAppUser({ gatewayBaseUrl: GW, connectionAPIKey: k, connectorId: CID });
    await deleteConnectionKeyForUser(context.userId, CID);
    return { ok: true };
  });

type Site = { siteUrl: string; permissionLevel: string };

export const listMySites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await call(context.userId, "/webmasters/v3/sites");
    if (r.state !== "ok") return { state: r.state, sites: [] as Site[] };
    const sites = ((r.json.siteEntry ?? []) as Site[]).filter((s) => s.permissionLevel !== "siteUnverifiedUser");
    return { state: "ok" as const, sites };
  });

async function verifiedSite(userId: string, siteUrl: string) {
  const r = await call(userId, "/webmasters/v3/sites");
  if (r.state !== "ok") throw new Error("Vuelve a conectar Search Console.");
  const ok = ((r.json.siteEntry ?? []) as Site[]).some((s) => s.siteUrl === siteUrl && s.permissionLevel !== "siteUnverifiedUser");
  if (!ok) throw new Error("Esa propiedad no está verificada en tu Search Console.");
  return siteUrl;
}

export const siteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { siteUrl: string }) => ({ siteUrl: String(i.siteUrl).slice(0, 300) }))
  .handler(async ({ data, context }) => {
    const site = await verifiedSite(context.userId, data.siteUrl);
    const enc = encodeURIComponent(site);
    const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
    const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const q = (dimensions: string[]) => call(context.userId, `/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit: 25 }),
    });
    const [tot, queries, pages, maps] = await Promise.all([q([]), q(["query"]), q(["page"]), call(context.userId, `/webmasters/v3/sites/${enc}/sitemaps`)]);
    type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
    const rows = (x: typeof tot) => (x.state === "ok" ? ((x.json.rows ?? []) as Row[]) : []);
    return {
      periodo: { start, end },
      total: rows(tot)[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      consultas: rows(queries),
      paginas: rows(pages),
      sitemaps: maps.state === "ok" ? ((maps.json.sitemap ?? []) as { path: string; lastSubmitted?: string; errors?: string; warnings?: string }[]) : [],
    };
  });

export const submitSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { siteUrl: string; sitemapUrl: string }) => ({ siteUrl: String(i.siteUrl).slice(0, 300), sitemapUrl: String(i.sitemapUrl).slice(0, 500) }))
  .handler(async ({ data, context }) => {
    const site = await verifiedSite(context.userId, data.siteUrl);
    const sm = new URL(data.sitemapUrl);
    if (!/^https?:$/.test(sm.protocol)) throw new Error("Dirección del mapa del sitio no válida.");
    const r = await call(context.userId, `/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sm.toString())}`, { method: "PUT" });
    if (r.state !== "ok") throw new Error("Vuelve a conectar Search Console.");
    return { ok: true };
  });

export const inspectUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { siteUrl: string; url: string }) => ({ siteUrl: String(i.siteUrl).slice(0, 300), url: String(i.url).slice(0, 500) }))
  .handler(async ({ data, context }) => {
    const site = await verifiedSite(context.userId, data.siteUrl);
    const r = await call(context.userId, "/v1/urlInspection/index:inspect", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: data.url, siteUrl: site, languageCode: "es" }),
    });
    if (r.state !== "ok") throw new Error("Vuelve a conectar Search Console.");
    const ir = r.json.inspectionResult?.indexStatusResult ?? {};
    return { veredicto: String(ir.verdict ?? "—"), cobertura: String(ir.coverageState ?? "—"), ultimoRastreo: String(ir.lastCrawlTime ?? "—"), canonica: String(ir.googleCanonical ?? "—") };
  });
