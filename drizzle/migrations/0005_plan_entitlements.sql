CREATE OR REPLACE FUNCTION public.plan_tier(p_user uuid, p_env text)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE s.price_id WHEN 'lumina_monthly' THEN 'basico' WHEN 'lumina_quarterly' THEN 'avanzado' WHEN 'lumina_yearly' THEN 'total' END
  FROM public.subscriptions s
  WHERE s.user_id = p_user AND s.environment = p_env
    AND ((s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
      OR (s.status = 'canceled' AND s.current_period_end > now()))
  ORDER BY s.created_at DESC LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.plan_tier(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.plan_tier(uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.my_plan(p_env text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE t text; used int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  t := public.plan_tier(auth.uid(), p_env);
  SELECT count(*) INTO used FROM public.analysis_runs WHERE user_id = auth.uid() AND status <> 'failed' AND created_at >= date_trunc('month', now());
  RETURN jsonb_build_object('tier', t, 'used', used, 'limit', CASE t WHEN 'basico' THEN 15 WHEN 'avanzado' THEN 90 ELSE NULL END);
END $$;
REVOKE ALL ON FUNCTION public.my_plan(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_plan(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_analysis(p_filename text, p_agent_slug text, p_env text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r uuid; t text; used int; lim int;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión para analizar'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(auth.uid()::text));
  t := public.plan_tier(auth.uid(), p_env);
  IF t IS NULL THEN RAISE EXCEPTION 'Empieza tus 3 días gratis en Suscripciones para analizar archivos.'; END IF;
  lim := CASE t WHEN 'basico' THEN 15 WHEN 'avanzado' THEN 90 ELSE NULL END;
  UPDATE public.analysis_runs SET status='failed', error=coalesce(error,'Interrumpido') WHERE user_id=auth.uid() AND status='running' AND created_at < now() - interval '10 minutes';
  IF lim IS NOT NULL THEN
    SELECT count(*) INTO used FROM public.analysis_runs WHERE user_id = auth.uid() AND status <> 'failed' AND created_at >= date_trunc('month', now());
    IF used >= lim THEN RAISE EXCEPTION 'Has llegado a los % archivos de este mes. Mejora tu plan en Suscripciones para seguir.', lim; END IF;
  END IF;
  INSERT INTO public.analysis_runs(user_id, filename, agent_slug) VALUES(auth.uid(), left(p_filename,200), left(p_agent_slug,100)) RETURNING id INTO r;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.claim_analysis(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_analysis(text, text, text) TO authenticated;

DROP FUNCTION IF EXISTS public.claim_free_analysis(text, text);