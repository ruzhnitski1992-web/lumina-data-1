import {afterEach,describe,expect,it,vi} from "vitest";
import {readNews} from "@/lib/news.server";
afterEach(() => vi.unstubAllGlobals());
describe("News source", () => {
  it("keeps publication separate from retrieval and reuses a cached response", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('<rss><channel><item><title>Market &amp; data</title><link>https://news.google.com/test</link><pubDate>Fri, 09 Oct 2026 08:00:00 GMT</pubDate><source url="https://source.test">Official source</source></item></channel></rss>'));
    vi.stubGlobal("fetch",fetcher);
    const result = await readNews("finanzas","en");
    expect(result.error).toBeNull();
    expect(result.items[0]).toEqual({title:"Market & data",url:"https://news.google.com/test",published:"2026-10-09T08:00:00.000Z",source:"Official source"});
    expect(result.checkedAt).not.toBe(result.items[0]?.published);
    await readNews("finanzas","en");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("shows a source failure without inventing news", async () => {
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("",{status:503})));
    const result = await readNews("riesgo","en");
    expect(result.items).toEqual([]);
    expect(result.error).toContain("No se pudo actualizar");
  });
});