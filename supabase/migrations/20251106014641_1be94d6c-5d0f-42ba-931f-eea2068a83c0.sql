-- Create broadcast_alerts table to log all alert events
CREATE TABLE IF NOT EXISTS public.broadcast_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- 'webhook_failure', 'missing_field', 'queue_failure', 'email_failure'
  severity TEXT NOT NULL DEFAULT 'error', -- 'error', 'warning', 'info'
  error_message TEXT,
  failed_payload JSONB,
  missing_fields TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  alert_sent BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broadcast_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can view/manage alerts
CREATE POLICY "Admins can view all broadcast alerts"
  ON public.broadcast_alerts
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage broadcast alerts"
  ON public.broadcast_alerts
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_broadcast_alerts_timestamp ON public.broadcast_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_alerts_resolved ON public.broadcast_alerts(resolved, timestamp DESC);

-- Create broadcast_weekly_summary table
CREATE TABLE IF NOT EXISTS public.broadcast_weekly_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_broadcasts_scheduled INTEGER DEFAULT 0,
  total_broadcasts_sent INTEGER DEFAULT 0,
  total_emails_sent INTEGER DEFAULT 0,
  total_subscribers INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2),
  failures_count INTEGER DEFAULT 0,
  summary_sent BOOLEAN DEFAULT false,
  summary_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broadcast_weekly_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view weekly summaries"
  ON public.broadcast_weekly_summary
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage summaries"
  ON public.broadcast_weekly_summary
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');