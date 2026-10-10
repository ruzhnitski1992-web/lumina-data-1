const SITE = "https://luminadatainsights.com";

export function pageHead(title: string, description: string, path?: string) {
  const full = title.length > 44 ? `${title} | Lumina` : `${title} | Lumina Data Insights`;
  const meta = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (path) {
    const url = `${SITE}${path}`;
    meta.push({ property: "og:url", content: url });
    return { meta, links: [{ rel: "canonical", href: url }] };
  }
  return { meta };
}
