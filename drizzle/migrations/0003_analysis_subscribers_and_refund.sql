CREATE OR REPLACE FUNCTION public.claim_free_analysis(p_filename text, p_agent_slug text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE r uuid; v_claim_run uuid; v_status text; v_created timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión para analizar'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(auth.uid()::text));
  IF NOT EXISTS (
    SELECT 1 FROM public.subscriptions s WHERE s.user_id = auth.uid()
      AND (s.status IN ('active','trialing','past_due') OR (s.status='canceled' AND s.current_period_end > now()))
      AND (s.current_period_end IS NULL OR s.current_period_end > now())
  ) THEN
    SELECT c.run_id, a.status, a.created_at INTO v_claim_run, v_status, v_created
      FROM public.trial_claims c JOIN public.analysis_runs a ON a.id = c.run_id
      WHERE c.user_id = auth.uid();
    IF v_claim_run IS NOT NULL THEN
      IF v_status = 'failed' OR (v_status = 'running' AND v_created < now() - interval '10 minutes') THEN
        UPDATE public.analysis_runs SET status='failed', error=coalesce(error,'Interrumpido') WHERE id=v_claim_run AND status='running';
        DELETE FROM public.trial_claims WHERE user_id = auth.uid();
      ELSE
        RAISE EXCEPTION 'Tu prueba gratuita ya se ha utilizado. Elige un plan en Suscribirte para seguir analizando.';
      END IF;
    END IF;
    INSERT INTO public.analysis_runs(user_id, filename, agent_slug) VALUES(auth.uid(), left(p_filename,200), left(p_agent_slug,100)) RETURNING id INTO r;
    INSERT INTO public.trial_claims(user_id,run_id) VALUES(auth.uid(),r);
  ELSE
    INSERT INTO public.analysis_runs(user_id, filename, agent_slug) VALUES(auth.uid(), left(p_filename,200), left(p_agent_slug,100)) RETURNING id INTO r;
  END IF;
  RETURN r;
END $$;
UPDATE public.analysis_runs SET status='failed', error='Interrumpido' WHERE status='running' AND created_at < now() - interval '10 minutes';