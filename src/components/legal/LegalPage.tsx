import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Printer, AlertTriangle } from "lucide-react";
import { empresa } from "@/config/empresa";
import { renderLegal, inline } from "@/lib/legal-md";

const others = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
];

export function LegalPage({ md, path }: { md: string; path: string }) {
  const { nodes, headings, title } = useMemo(() => renderLegal(md), [md]);
  const [active, setActive] = useState(headings[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      const v = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (v) setActive(v.target.id);
    }, { rootMargin: "-90px 0px -70% 0px" });
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [headings]);

  const toc = (
    <ul className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} onClick={() => setTocOpen(false)} aria-current={active === h.id ? "location" : undefined}
            className={`block rounded px-2 py-1 leading-snug transition-colors ${h.level === 3 ? "pl-5" : "font-semibold"} ${active === h.id ? "bg-lp-alt text-lp-blue" : "text-lp-slate hover:text-lp-blue"}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="pt-[76px]">
      {empresa.borradorLegal && (
        <div role="note" className="bg-[color:var(--lp-draft-strong)] text-lp-ink">
          <p className="mx-auto flex max-w-[1280px] items-center gap-2 px-5 py-2.5 text-sm font-semibold"><AlertTriangle className="h-4 w-4 shrink-0" />Texto pendiente de revisión jurídica</p>
        </div>
      )}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:order-none" data-noprint>
          <div className="lg:hidden">
            <button aria-expanded={tocOpen} aria-controls="legal-toc" onClick={() => setTocOpen(!tocOpen)} className="flex w-full items-center justify-between rounded-xl border border-lp-line px-4 py-3 font-semibold text-lp-ink">
              Índice<ChevronDown className={`h-5 w-5 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
            </button>
            {tocOpen && <nav id="legal-toc" aria-label="Índice" className="mt-2 rounded-xl border border-lp-line p-3">{toc}</nav>}
          </div>
          <nav aria-label="Índice" className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
            <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-lp-muted">Índice</p>
            {toc}
          </nav>
        </aside>
        <article className="legal-body min-w-0 max-w-[760px] text-[16.5px] leading-[1.7] text-lp-slate">
          <h1 className="text-4xl font-extrabold text-lp-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-lp-muted">Última actualización: {inline(empresa.fechaActualizacionLegal)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" data-noprint>
            {others.filter((o) => o.href !== path).map((o) => <a key={o.href} href={o.href} className="font-medium text-lp-blue hover:underline">{o.label}</a>)}
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-md border border-lp-line px-3 py-1.5 font-medium text-lp-ink hover:border-lp-blue"><Printer className="h-4 w-4" />Imprimir</button>
          </div>
          <div className="mt-6">{nodes}</div>
        </article>
      </div>
    </main>
  );
}
