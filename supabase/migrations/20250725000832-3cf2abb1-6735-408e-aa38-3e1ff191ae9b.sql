-- Create rate limiting table for security
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  window_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, action_type, window_start)
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for system operations
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- Create function for rate limiting check
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier TEXT,
  _action_type TEXT,
  _max_requests INTEGER DEFAULT 5,
  _window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_window_start TIMESTAMP WITH TIME ZONE;
  current_window_end TIMESTAMP WITH TIME ZONE;
  current_count INTEGER;
BEGIN
  -- Calculate current window
  current_window_start := date_trunc('hour', now()) + 
    (EXTRACT(minute FROM now())::INTEGER / _window_minutes) * (_window_minutes || ' minutes')::INTERVAL;
  current_window_end := current_window_start + (_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current count for this window
  SELECT request_count INTO current_count
  FROM public.rate_limits
  WHERE identifier = _identifier
    AND action_type = _action_type
    AND window_start = current_window_start;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, request_count, window_start, window_end)
    VALUES (_identifier, _action_type, 1, current_window_start, current_window_end)
    ON CONFLICT (identifier, action_type, window_start) 
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= _max_requests THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits
  SET request_count = request_count + 1
  WHERE identifier = _identifier
    AND action_type = _action_type
    AND window_start = current_window_start;
  
  RETURN true;
END;
$$;

-- Create security audit log table
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admins only
CREATE POLICY "Only admins can view security logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for system to insert logs
CREATE POLICY "System can insert security logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _user_id UUID DEFAULT NULL,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _details JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (event_type, user_id, ip_address, user_agent, details)
  VALUES (_event_type, _user_id, _ip_address, _user_agent, _details);
END;
$$;

-- Clean up old rate limit records (function for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_end < now() - INTERVAL '24 hours';
END;
$$;