import { createServerFn } from "@tanstack/react-start";
export const newsAreas = ["general", "finanzas", "clientes", "operaciones", "riesgo", "seo", "ia"] as const;
export type NewsArea = typeof newsAreas[number];
export type NewsItem = {title: string; url: string; published: string | null; source: string};
export type NewsResponse = {items: NewsItem[]; checkedAt: string; error: string | null};
export const getNews = createServerFn({method: "GET"}).inputValidator((input: {area: NewsArea; language?: "es" | "en"}) => {
  if (!newsAreas.includes(input.area)) throw new Error("Área no válida");
  return {area: input.area, language: input.language === "en" ? "en" as const : "es" as const};
}).handler(async ({data}): Promise<NewsResponse> => {
  const {readNews} = await import("./news.server");
  return readNews(data.area, data.language);
});