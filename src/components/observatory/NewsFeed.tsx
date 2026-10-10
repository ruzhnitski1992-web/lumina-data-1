import {useSuspenseQuery} from "@tanstack/react-query";
import {ExternalLink} from "lucide-react";
import {getNews, type NewsArea} from "@/lib/news.functions";
import {useLanguage} from "@/components/site/LanguageProvider";
export const newsOptions = (area: NewsArea, language: "es" | "en" = "es") => ({queryKey: ["news",area,language], queryFn: () => getNews({data: {area,language}}), staleTime: 60 * 60_000, refetchInterval: 60 * 60_000});
export function NewsFeed({area = "general"}: {area?: NewsArea}) {
  const {language} = useLanguage();
  const {data} = useSuspenseQuery(newsOptions(area, language));
  const locale = language === "en" ? "en-GB" : "es-ES";
  return <div><p className="text-xs text-lp-muted">Última consulta de la fuente: <time dateTime={data.checkedAt}>{new Date(data.checkedAt).toLocaleString(locale, {timeZone: "Europe/Madrid"})}</time> · Google News · Publicaciones de los últimos 7 días</p>{data.error && <p role="status" className="mt-3 text-sm text-lp-alert">{data.error}</p>}<div className="mt-6 grid gap-x-8 md:grid-cols-2">{data.items.map(item => <article key={item.url} className="border-t border-lp-line py-5"><p className="text-xs text-lp-muted">{item.source} · {item.published ? <time dateTime={item.published}>{new Date(item.published).toLocaleDateString(locale)}</time> : "Fecha no disponible"}</p><h3 className="mt-2 text-lg font-bold"><a href={item.url} target="_blank" rel="noreferrer" className="hover:text-lp-blue">{item.title}<ExternalLink aria-hidden className="ml-2 inline h-4 w-4 text-lp-blue" /></a></h3></article>)}</div>{!data.items.length && <p className="mt-4 text-lp-muted">No hay publicaciones disponibles para esta consulta.</p>}</div>;
}