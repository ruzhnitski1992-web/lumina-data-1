import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { AssistantWidget } from "@/components/site/AssistantWidget";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "@/components/site/LanguageProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o se ha movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumina Data Insights" },
      { name: "description", content: "Lumina Data Insights — Inteligencia artificial agéntica para finanzas y operaciones." },
      { property: "og:title", content: "Lumina Data Insights" },
      { property: "og:description", content: "Inteligencia artificial agéntica para finanzas y operaciones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "google-site-verification",
        content: "bRmuAaohSFYJQNpL6eTNlFkewQ5S1wfLXyA84bJhqaQ",
      },
      {
        name: "google-site-verification",
        content: "e8PMPzzBFtTjMFF7EyLlFSguklSUM5uHhOn6sfHqZpA",
      },
      {
        name: "google-site-verification",
        content: "mImXzusgPrTt0pdbpOu4O8mKIdq7UoFJd8Uhw6PiXm4",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LUMINA DATA INSIGHTS",
            legalName: "LUMINA DATA INSIGHTS",
            vatID: "CIF B6847213",
            url: "https://luminadatainsights.com",
            logo: "https://luminadatainsights.com/favicon.png",
            email: "atteencliente.022@gmail.com",
            description:
              "Inteligencia artificial agéntica para finanzas, ventas, operaciones, riesgo y posicionamiento en buscadores.",
            knowsAbout: [
              "analítica de datos",
              "agentes de IA",
              "SEO",
              "tesorería",
              "cumplimiento normativo",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "LUMINA DATA INSIGHTS",
            image: "https://luminadatainsights.com/favicon.png",
            url: "https://luminadatainsights.com",
            email: "atteencliente.022@gmail.com",
            priceRange: "€€",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Av. del Carrilet, 3, Planta 2 Edificio D",
              addressLocality: "Barcelona",
              addressRegion: "Cataluña",
              postalCode: "08902",
              addressCountry: "ES",
            },
            areaServed: "ES",
          },
        ]),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(()=>{const {data}=supabase.auth.onAuthStateChange(event=>{if(!["SIGNED_IN","SIGNED_OUT","USER_UPDATED"].includes(event))return;void router.invalidate();if(event!=="SIGNED_OUT")void queryClient.invalidateQueries();});return()=>data.subscription.unsubscribe();},[router,queryClient]);

  return (
    <QueryClientProvider client={queryClient}><TooltipProvider><LanguageProvider>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-lp-blue focus:px-4 focus:py-2 focus:text-lp-on-dark">Saltar al contenido</a>
      <Header />
      <div id="contenido">
        <Outlet />
      </div>
      <Footer />
      <CookieBanner />
      <AssistantWidget />
    </LanguageProvider></TooltipProvider></QueryClientProvider>
  );
}
