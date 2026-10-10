import logo from "@/assets/lumina-logo-light.png.asset.json";
import {
  agentCategories,
  solutionAreas,
  analytics,
  company,
  resources,
  legal,
} from "@/lib/site-data";
import { empresa } from "@/config/empresa";
import { openCookieSettings } from "@/lib/consent";
import { Button } from "@/components/ui/button";
const cols = [
  {
    title: "Agentes IA",
    items: agentCategories.map((c) => ({ label: c.name, href: `/agentes/categoria/${c.id}` })),
  },
  { title: "Soluciones", items: solutionAreas },
  { title: "Analítica", items: analytics },
  { title: "Empresa", items: company },
  { title: "Recursos", items: resources },
];
export function Footer() {
  return (
    <footer className="border-t border-lp-line bg-lp-soft text-lp-ink">
      <div className="mx-auto max-w-[1280px] px-5 py-14">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
          <a
            href="/"
            className="brand-logo flex h-24 w-full max-w-[340px] items-center justify-center"
          >
            <img
              src={logo.url}
              alt="Lumina Data Insights"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </a>
          <div>
            <p className="font-semibold">Inteligencia aplicada a la rentabilidad.</p>
          </div>
          <Button asChild>
            <a href="/suscripciones">Suscribirte</a>
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="text-sm font-bold">{c.title}</h2>
              <ul className="mt-4 space-y-3">
                {c.items.map((i) => (
                  <li key={i.href}>
                    <a className="text-sm text-lp-muted hover:text-lp-blue" href={i.href}>
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <address className="mt-12 border-t border-lp-line pt-6 text-sm not-italic text-lp-slate">
          {empresa.razonSocial} · CIF {empresa.nif}
          <br />
        </address>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-lp-muted">
          <span>© 2026 Lumina Data Insights</span>
          {legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <Button variant="link" className="h-auto p-0 text-xs" onClick={openCookieSettings}>
            Configuración de cookies
          </Button>
        </div>
        <p className="mt-6 text-xs text-lp-muted">Contacta con nuestro equipo para cualquier duda o ayuda: <a href={`mailto:${empresa.email}`} className="break-all underline">{empresa.email}</a></p>
      </div>
    </footer>
  );
}
