CREATE TABLE public.sources (
  id text PRIMARY KEY,
  name text NOT NULL,
  kind text NOT NULL,
  url text NOT NULL,
  refresh_minutes int NOT NULL DEFAULT 60,
  last_synced_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  last_error text,
  item_count int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.sources TO anon, authenticated;
GRANT ALL ON public.sources TO service_role;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sources" ON public.sources FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.external_items (
  id text PRIMARY KEY,
  source_id text NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  summary text NOT NULL DEFAULT '',
  authors text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  published_at timestamptz,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX external_items_source_pub ON public.external_items (source_id, published_at DESC);
GRANT SELECT ON public.external_items TO anon, authenticated;
GRANT ALL ON public.external_items TO service_role;
ALTER TABLE public.external_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read items" ON public.external_items FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.indicator_values (
  indicator text NOT NULL,
  country text NOT NULL,
  year text NOT NULL,
  value double precision,
  source_id text NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (indicator, country, year)
);
GRANT SELECT ON public.indicator_values TO anon, authenticated;
GRANT ALL ON public.indicator_values TO service_role;
ALTER TABLE public.indicator_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read indicators" ON public.indicator_values FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.sources (id, name, kind, url, refresh_minutes) VALUES
 ('arxiv-ai', 'arXiv · IA (cs.AI, cs.CL, cs.LG, cs.CV, stat.ML)', 'research', 'https://arxiv.org', 60),
 ('arxiv-ro', 'arXiv · Robótica (cs.RO)', 'research', 'https://arxiv.org/list/cs.RO/recent', 60),
 ('worldbank', 'Banco Mundial · Indicadores', 'indicators', 'https://data.worldbank.org', 1440);