import { useEffect, useState } from "react";
import { empresa } from "@/config/empresa";

export type Consent = { necesarias: true; analisis: boolean; terceros: boolean; fecha: string; version: string };
const NAME = "lumina_consent";
const MAX_AGE = 60 * 60 * 24 * 730; // 24 meses

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(NAME + "="));
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw.slice(NAME.length + 1))) as Consent;
    const age = Date.now() - new Date(c.fecha).getTime();
    if (c.version !== empresa.versionPoliticas || age > MAX_AGE * 1000) return null;
    return c;
  } catch { return null; }
}

function deleteGaCookies() {
  const host = location.hostname;
  const domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
  document.cookie.split("; ").map((c) => c.split("=")[0]!).filter((n) => n === "_ga" || n.startsWith("_ga_")).forEach((n) => {
    domains.forEach((d) => { document.cookie = `${n}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`; });
  });
}

let gaLoaded = false;
function applyAnalytics(on: boolean) {
  const id = empresa.gaMeasurementId;
  if (!empresa.usaAnalitica || !id) return;
  const w = window as unknown as { [k: string]: unknown; dataLayer: unknown[] };
  if (on && !gaLoaded) {
    w[`ga-disable-${id}`] = false;
    const s = document.createElement("script");
    s.async = true; s.id = "lumina-ga";
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    w.dataLayer = w.dataLayer || [];
    const gtag = (...a: unknown[]) => { w.dataLayer.push(a); };
    gtag("js", new Date()); gtag("config", id, { anonymize_ip: true });
    gaLoaded = true;
  } else if (!on) {
    w[`ga-disable-${id}`] = true;
    document.getElementById("lumina-ga")?.remove();
    gaLoaded = false;
    deleteGaCookies();
  }
}

export function saveConsent(v: { analisis: boolean; terceros: boolean }) {
  const c: Consent = { necesarias: true, analisis: v.analisis, terceros: v.terceros, fecha: new Date().toISOString(), version: empresa.versionPoliticas };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NAME}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${MAX_AGE}; path=/; SameSite=Lax${secure}`;
  if (!v.analisis) deleteGaCookies();
  applyAnalytics(v.analisis);
  window.dispatchEvent(new Event("lumina:consent"));
}

export function initConsent() {
  const c = readConsent();
  if (c?.analisis) applyAnalytics(true);
  else deleteGaCookies();
}

export const openCookieSettings = () => window.dispatchEvent(new Event("lumina:cookies"));

export function useConsent() {
  const [c, setC] = useState<Consent | null>(null);
  useEffect(() => {
    setC(readConsent());
    const on = () => setC(readConsent());
    window.addEventListener("lumina:consent", on);
    return () => window.removeEventListener("lumina:consent", on);
  }, []);
  return c;
}
