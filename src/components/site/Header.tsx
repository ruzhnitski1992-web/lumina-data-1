import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { LanguageSwitch } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";
import logo from "@/assets/lumina-logo-light.png.asset.json";
import {
  agentCategories,
  agents,
  solutionAreas,
  sectors,
  analytics,
  resources,
  aiProviders,
  type NavItem,
} from "@/lib/site-data";

type Menu = "agentes" | "soluciones" | "analitica" | "recursos" | "empresa" | "noticias";

const simple: { label: string; href: string }[] = [
  { label: "¿Cómo funciona?", href: "/#como-funciona" },
  { label: "Casos de Éxito", href: "/casos-de-exito" },
  { label: "Planes", href: "/suscripciones" },
];
const menus: { id: Menu; label: string }[] = [
  { id: "agentes", label: "Agentes IA" },
  { id: "soluciones", label: "Secciones" },
  { id: "analitica", label: "Analítica" },
  { id: "recursos", label: "Recursos" },
  { id: "empresa", label: "Empresa" },
  { id: "noticias", label: "Últimas noticias" },
];

function Item({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-lp-alt focus-visible:bg-lp-alt"
    >
      {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-lp-blue" aria-hidden />}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-lp-ink">{item.label}</span>
        {item.desc && <span className="block text-xs leading-snug text-lp-muted">{item.desc}</span>}
      </span>
    </a>
  );
}

function Featured({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-lp-alt p-6 text-lp-ink">
      <div>
        <p className="text-xl font-bold leading-tight">{title}</p>
        <p className="mt-3 text-sm opacity-75">{text}</p>
      </div>
      <a
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lp-blue hover:underline"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function MenuPanel({ id }: { id: Menu }) {
  if (id === "empresa") return <div className="grid gap-4 md:grid-cols-3">{[...simple, {label: "Sobre nosotros", href: "/empresa/sobre-nosotros"}].map(item => <Item key={item.href} item={item} />)}</div>;
  if (id === "noticias") return <div className="grid gap-4 md:grid-cols-3">{[{label: "Noticias de analítica mundial", href: "/noticias", desc: "Finanzas, clientes, operaciones, riesgo y SEO: fuentes y fechas"}, {label: "Investigación en IA", href: "/observatorio-ia", desc: "Últimas publicaciones y proveedores"}, {label: "Indicadores oficiales", href: "/datos-mundiales", desc: "PIB, inflación, empleo e innovación"}].map(item => <Item key={item.href} item={item} />)}</div>;
  if (id === "agentes")
    return (
      <div className="grid grid-cols-[1fr_260px] gap-6">
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {agentCategories.map((c) => (
            <div key={c.id}>
              <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-lp-muted">
                {c.name}
              </p>
              {agents
                .filter((x) => x.category === c.id)
                .slice(0, 3)
                .map((ag) => (
                  <Item
                    key={ag.slug}
                    item={{ label: ag.name, href: `/agentes/${ag.slug}`, icon: ag.icon }}
                  />
                ))}
              <a
                href={`/agentes/categoria/${c.id}`}
                className="mt-1 block px-2 text-xs font-semibold text-lp-blue hover:underline"
              >
                Ver todos
              </a>
            </div>
          ))}
        </div>
        <div><p className="px-2 text-sm font-bold">IA integradas en Lumina</p>{aiProviders.map(item => <Item key={item.href} item={item} />)}<Item item={{label: "Catálogo de los 40 agentes", href: "/agentes", desc: "Misiones, soluciones y entregables"}} /></div>
      </div>
    );
  if (id === "soluciones")
    return (
      <div className="grid grid-cols-[1fr_1fr_260px] gap-6">
        <div>
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-lp-muted">
            Por área
          </p>
          <div className="grid grid-cols-2 gap-1">
            {solutionAreas.map((i) => (
              <Item key={i.href} item={i} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-lp-muted">
            Por sector
          </p>
          <div className="grid grid-cols-2 gap-1">
            {sectors.map((i) => (
              <Item key={i.href} item={i} />
            ))}
          </div>
        </div>
        <Featured
          title="Prueba gratis, una sola vez"
          text="Sube un archivo y los agentes lo analizan al momento. Después, elige tu plan."
          href="/app"
          cta="Probar ahora"
        />
      </div>
    );
  if (id === "analitica")
    return (
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="grid grid-cols-3 gap-1">
          {analytics.map((i) => (
            <Item key={i.href} item={i} />
          ))}
          <Item item={{label: "Noticias de analítica mundial", href: "/noticias", desc: "Novedades por área empresarial"}} />
          <Item item={{label: "Datos mundiales", href: "/datos-mundiales", desc: "Comparativas oficiales por país"}} />
        </div>
        <div className="rounded-xl bg-lp-alt p-6 text-lp-ink">
          <p className="text-sm font-bold">Escalera de madurez analítica</p>
          <div className="mt-4 flex items-end gap-1.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex-1 rounded-t bg-lp-blue"
                style={{ height: n * 14, opacity: 0.4 + n * 0.12 }}
              />
            ))}
          </div>
          <a
            href="/analitica"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lp-blue hover:underline"
          >
            Explorar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  return (
    <div className="grid grid-cols-[1fr_260px] gap-6">
      <div className="grid grid-cols-2 gap-1">
        {resources.map((i) => (
          <Item key={i.href} item={i} />
        ))}
      </div>
      <Featured
        title="¿Cuánto te cuestan tus datos oscuros?"
        text="Estima en dos minutos tus ingresos anuales en riesgo."
        href="/calculadora-de-perdidas"
        cta="Abrir calculadora"
      />
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<Menu | null>(null);
  const [mobile, setMobile] = useState(false);
  const [acc, setAcc] = useState<Menu | null>(null);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const key = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(null), setMobile(false));
    const click = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(null);
    window.addEventListener("keydown", key);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("keydown", key);
      document.removeEventListener("click", click);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const solid = scrolled || open !== null;
  const enter = (id: Menu) => {
    clearTimeout(timer.current);
    setOpen(id);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(null), 150);
  };

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "border-b border-lp-line bg-lp-bg/85 shadow-lp backdrop-blur-lg" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[84px] sm:px-5 xl:gap-2">
        <a
          href="/"
          aria-label="Lumina Data Insights — Inicio"
          className="brand-logo flex h-[44px] w-[180px] min-w-0 shrink items-center justify-start sm:h-[58px] sm:w-[240px] xl:w-[200px] xl:shrink-0"
        >
          <img
            src={logo.url}
            alt="Lumina Data Insights"
            width={986}
            height={243}
            className="h-full w-full object-contain"
          />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-1 xl:flex">
          {menus.map((m) => (
            <div key={m.id} onMouseEnter={() => enter(m.id)} onMouseLeave={leave}>
              <Button
                variant="ghost"
                aria-expanded={open === m.id}
                aria-controls={`mm-${m.id}`}
                onClick={() => setOpen(open === m.id ? null : m.id)}
                className={`flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:text-lp-blue ${open === m.id ? "text-lp-blue" : "text-lp-ink"}`}
              >
                {m.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${open === m.id ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </Button>
            </div>
          ))}
        </nav>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <span className="hidden xl:block"><LanguageSwitch /></span>
          <Button asChild className="hidden xl:inline-flex"><a href="/suscripciones">Suscribirte</a></Button>
          <Button
            variant="ghost"
            onClick={() => setMobile(true)}
            aria-label="Abrir menú"
            className="rounded-md p-2 text-lp-ink xl:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {menus.map((m) => (
        <div
          key={m.id}
          id={`mm-${m.id}`}
          onMouseEnter={() => enter(m.id)}
          onMouseLeave={leave}
          className={`absolute inset-x-0 top-full hidden max-h-[calc(100dvh-84px)] overflow-y-auto border-b border-lp-line bg-lp-bg shadow-lp transition-all duration-200 xl:block ${open === m.id ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
          inert={open !== m.id}
        >
          <div className="mx-auto max-w-[1440px] px-5 py-8">
            <MenuPanel id={m.id} />
          </div>
        </div>
      ))}

      {mobile && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-lp-bg text-lp-ink"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div className="flex h-[84px] items-center justify-between px-5">
            <a
              href="/"
              className="brand-logo flex h-[52px] w-[min(230px,65%)] items-center justify-center"
            >
              <img
                src={logo.url}
                alt="Lumina Data Insights"
                width={986}
                height={243}
                className="h-full w-full object-contain"
              />
            </a>
            <LanguageSwitch />
            <Button
              variant="ghost"
              onClick={() => setMobile(false)}
              aria-label="Cerrar menú"
              className="p-2"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav aria-label="Móvil" className="flex-1 overflow-y-auto px-5 pb-28">
            {menus.map((m) => {
              const items: NavItem[] =
                m.id === "agentes"
                  ? agentCategories
                      .map((c): NavItem => ({ label: c.name, href: `/agentes/categoria/${c.id}` }))
                      .concat([...aiProviders, { label: "Ver todos los agentes", href: "/agentes" }])
                  : m.id === "soluciones"
                    ? [...solutionAreas, ...sectors]
                    : m.id === "analitica"
                       ? [...analytics, {label: "Noticias de analítica mundial", href: "/noticias"}]
                       : m.id === "empresa" ? [...simple, {label: "Sobre nosotros", href: "/empresa/sobre-nosotros"}]
                       : m.id === "noticias" ? [{label: "Noticias de analítica mundial", href: "/noticias"}, {label: "Investigación en IA", href: "/observatorio-ia"}, {label: "Datos mundiales", href: "/datos-mundiales"}]
                       : resources;
              return (
                <div key={m.id} className="border-b border-lp-line">
                  <Button
                    variant="ghost"
                    aria-expanded={acc === m.id}
                    onClick={() => setAcc(acc === m.id ? null : m.id)}
                    className="flex w-full items-center justify-between py-4 text-lg font-semibold"
                  >
                    {m.label}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${acc === m.id ? "rotate-180" : ""}`}
                    />
                  </Button>
                  {acc === m.id && (
                    <ul className="pb-4">
                      {items.map((i) => (
                        <li key={i.href + i.label}>
                          <a
                            href={i.href}
                            onClick={() => setMobile(false)}
                            className="block py-2 text-sm opacity-80 hover:opacity-100"
                          >
                            {i.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            {simple.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setMobile(false)}
                className="block border-b border-lp-line py-4 text-lg font-semibold"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <div className="fixed inset-x-0 bottom-0 bg-lp-bg p-5">
            <a
              href="/app"
              onClick={() => setMobile(false)}
              className="block rounded-lg bg-lp-blue py-3.5 text-center font-semibold text-lp-on-dark"
            >
              Prueba única gratis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
