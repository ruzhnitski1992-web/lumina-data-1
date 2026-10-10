<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the supplied brand image in a Lovable Assets pointer and fit it proportionally in dedicated logo containers; this preserves its original lettering and avoids shipping binary media in source.
- Site-wide nav/catalog data (agents, areas, sectors, analytics) lives in src/lib/site-data.ts; header, footer and pages read from it so menus and routes never drift.
- Sector-to-agent mappings and sector guidance live in src/lib/sector-agents.ts with a fallback profile for sectors not in the list, so every section can offer activation for any activity without hardcoding per page.
- The 3D network (three + @react-three/fiber) is only loaded lazily in the browser behind a static SVG fallback and disabled under prefers-reduced-motion; keeps SSR and LCP light.

- Detailed business content uses shared evidence-oriented records and a single renderer so category, agent and solution pages remain consistent.
- Private AI conversations use route-derived thread IDs and owner-scoped database records to prevent cross-thread and cross-account leakage.
- AI requests stream through server-only SDK providers; document analysis claims its account trial atomically before generation.
- Live voice uses a browser hook and server relay with client delegation; the Vite adapter is development-only.

- Voice upgrades require a server-verified, short-lived HttpOnly session cookie scoped to the live endpoint; this prevents anonymous paid sessions without exposing tokens in URLs.
- Section indexes use index routes and shared parents render Outlet to prevent swallowing detail routes.
- Static editorial translations use a shared bilingual dictionary and language provider; never translate user messages, generated reports or input values, preserving their original evidence.
- Worldwide news uses source RSS with bounded caching and single-flight refresh; display publication and fetch dates separately and never label stale results as current.
- Analytics decision workflows and agent mappings live in a shared guide so detail views remain consistent across techniques.
- SEO URL audits run server-side behind sign-in with private-host blocking, and keyword ideas come from the linked Google Ads account through the connector gateway; prevents open proxy abuse and keeps Ads credentials server-only.
- Per-client Google integrations use App User Connectors with encrypted, owner-keyed connection keys in app_user_connections (service-role only); keeps each customer's Google access isolated and server-side.
