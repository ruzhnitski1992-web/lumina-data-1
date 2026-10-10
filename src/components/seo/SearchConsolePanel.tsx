import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { completeSearchConsoleConnect, disconnectSearchConsole, inspectUrl, listMySites, siteReport, startSearchConsoleConnect, submitSitemap } from "@/lib/search-console.functions";

type Report = Awaited<ReturnType<typeof siteReport>>;

function waitFor(popup: Window) {
  return new Promise<string | null>((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      const t = e.data?.type;
      if (e.origin !== window.location.origin || e.source !== popup || e.data?.connectorId !== "google_search_console" || (t !== "appUserConnectorOAuthComplete" && t !== "appUserConnectorOAuthFailed")) return;
      cleanup();
      if (t === "appUserConnectorOAuthComplete") resolve(typeof e.data?.code === "string" ? e.data.code : null);
      else { popup.close(); reject(new Error("No se completó la conexión con Google.")); }
    };
    const poll = window.setInterval(() => { if (popup.closed) { cleanup(); reject(new Error("Cerraste la ventana de Google antes de terminar.")); } }, 500);
    const cleanup = () => { window.removeEventListener("message", onMsg); window.clearInterval(poll); };
    window.addEventListener("message", onMsg);
  });
}

export function SearchConsolePanel() {
  const fSites = useServerFn(listMySites), fStart = useServerFn(startSearchConsoleConnect), fDone = useServerFn(completeSearchConsoleConnect);
  const fOff = useServerFn(disconnectSearchConsole), fRep = useServerFn(siteReport), fMap = useServerFn(submitSitemap), fIns = useServerFn(inspectUrl);
  const [state, setState] = useState<"loading" | "disconnected" | "reconnect" | "ok">("loading");
  const [sites, setSites] = useState<{ siteUrl: string }[]>([]);
  const [site, setSite] = useState("");
  const [rep, setRep] = useState<Report | null>(null);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [smUrl, setSmUrl] = useState(""); const [insUrl, setInsUrl] = useState("");
  const [ins, setIns] = useState<Awaited<ReturnType<typeof inspectUrl>> | null>(null);

  const load = async () => { try { const r = await fSites(); setState(r.state); setSites(r.sites); } catch (e) { setErr(e instanceof Error ? e.message : "Error"); setState("disconnected"); } };
  useEffect(() => { void load(); }, []);

  const connect = async () => {
    setErr(""); const popup = window.open("", "lovable-oauth", "width=600,height=720");
    if (!popup) { setErr("Tu navegador ha bloqueado la ventana. Permite ventanas emergentes."); return; }
    try {
      const { authorizationUrl } = await fStart(); const p = waitFor(popup); popup.location.href = authorizationUrl;
      const code = await p; if (code) await fDone({ data: { code } });
      setMsg(state === "reconnect" ? "Search Console reconectado." : "Search Console conectado."); await load();
    } catch (e) { popup.close(); setErr(e instanceof Error ? e.message : "No se pudo conectar."); }
  };
  const pick = async (s: string) => { setSite(s); setRep(null); setErr(""); setSmUrl(s.startsWith("sc-domain:") ? `https://${s.slice(10)}/sitemap.xml` : `${s.replace(/\/$/, "")}/sitemap.xml`); setInsUrl(s.startsWith("sc-domain:") ? `https://${s.slice(10)}/` : s); if (!s) return; try { setRep(await fRep({ data: { siteUrl: s } })); } catch (e) { setErr(e instanceof Error ? e.message : "Error"); } };

  return (
    <section className="mt-10 rounded-2xl border border-lp-line p-5">
      <h2 className="text-xl font-bold text-lp-ink">Tu posicionamiento real en Google (Search Console)</h2>
      <p className="mt-1 text-sm text-lp-slate">Conecta tu cuenta de Google y gestiona desde aquí tus búsquedas, clics, posiciones y el envío del mapa del sitio, sin entrar en Google.</p>
      {msg && <p className="mt-3 text-sm font-semibold text-lp-blue">{msg}</p>}
      {err && <p role="alert" className="mt-3 text-sm text-destructive">{err}</p>}
      {state === "loading" && <p className="mt-3 text-sm text-lp-muted">Comprobando conexión…</p>}
      {(state === "disconnected" || state === "reconnect") && <div className="mt-4">
        {state === "reconnect" && <p className="mb-2 text-sm text-lp-slate">Tu acceso a Google necesita renovarse.</p>}
        <button onClick={connect} className="rounded-lg bg-lp-blue px-5 py-2.5 font-semibold text-lp-on-dark">{state === "reconnect" ? "Reconectar Google" : "Conectar mi Search Console"}</button>
      </div>}
      {state === "ok" && <div className="mt-4 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select value={site} onChange={(e) => pick(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-lp-line bg-lp-bg p-2.5">
            <option value="">Elige tu web…</option>{sites.map((s) => <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>)}
          </select>
          <button onClick={async () => { await fOff(); setSite(""); setRep(null); setMsg("Desconectado."); await load(); }} className="text-sm text-lp-muted underline">Desconectar</button>
        </div>
        {sites.length === 0 && <p className="text-sm text-lp-slate">Tu cuenta de Google no tiene webs verificadas en Search Console.</p>}
        {rep && <>
          <p className="text-xs text-lp-muted">Del {rep.periodo.start} al {rep.periodo.end}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Clics", rep.total.clicks.toLocaleString("es-ES")], ["Impresiones", rep.total.impressions.toLocaleString("es-ES")], ["CTR", `${(rep.total.ctr * 100).toFixed(1)} %`], ["Posición media", rep.total.position.toFixed(1)]].map(([k, v]) => <div key={k} className="rounded-xl border border-lp-line p-3 text-sm text-lp-slate">{k}<strong className="block text-lg text-lp-ink">{v}</strong></div>)}
          </div>
          <div className="overflow-x-auto rounded-xl border border-lp-line"><table className="w-full min-w-[480px] text-left text-sm"><thead><tr className="text-lp-muted"><th className="p-3">Búsqueda</th><th>Clics</th><th>Impresiones</th><th>Posición</th></tr></thead><tbody>{rep.consultas.map((r) => <tr key={r.keys?.[0]} className="border-t border-lp-line"><td className="p-3 text-lp-ink">{r.keys?.[0]}</td><td>{r.clicks}</td><td>{r.impressions}</td><td>{r.position.toFixed(1)}</td></tr>)}{rep.consultas.length === 0 && <tr><td className="p-3 text-lp-muted" colSpan={4}>Aún no hay búsquedas registradas.</td></tr>}</tbody></table></div>
          <div className="rounded-xl border border-lp-line p-4">
            <h3 className="font-semibold text-lp-ink">Enviar mapa del sitio a Google</h3>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={smUrl} onChange={(e) => setSmUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-lp-line bg-lp-bg p-2" /><button onClick={async () => { setErr(""); try { await fMap({ data: { siteUrl: site, sitemapUrl: smUrl } }); setMsg("Mapa del sitio enviado a Google."); setRep(await fRep({ data: { siteUrl: site } })); } catch (e) { setErr(e instanceof Error ? e.message : "Error"); } }} className="rounded-lg bg-lp-blue px-4 py-2 text-sm font-semibold text-lp-on-dark">Publicar en Google</button></div>
            <ul className="mt-2 text-xs text-lp-slate">{rep.sitemaps.map((s) => <li key={s.path}>{s.path} · enviado {s.lastSubmitted?.slice(0, 10) ?? "—"} · errores {s.errors ?? 0}</li>)}</ul>
          </div>
          <div className="rounded-xl border border-lp-line p-4">
            <h3 className="font-semibold text-lp-ink">¿Está esta página en Google?</h3>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={insUrl} onChange={(e) => setInsUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-lp-line bg-lp-bg p-2" /><button onClick={async () => { setErr(""); try { setIns(await fIns({ data: { siteUrl: site, url: insUrl } })); } catch (e) { setErr(e instanceof Error ? e.message : "Error"); } }} className="rounded-lg border border-lp-line px-4 py-2 text-sm">Comprobar</button></div>
            {ins && <p className="mt-2 text-sm text-lp-slate">Resultado: <strong className="text-lp-ink">{ins.veredicto === "PASS" ? "Indexada" : ins.veredicto}</strong> · {ins.cobertura} · último rastreo {ins.ultimoRastreo.slice(0, 10)}</p>}
          </div>
        </>}
      </div>}
    </section>
  );
}
