-- Create trigger function for logging admin access to sensitive tables
CREATE OR REPLACE FUNCTION public.log_admin_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is admin accessing data
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO public.security_audit_log (
      event_type,
      user_id,
      details
    ) VALUES (
      'admin_sensitive_data_access',
      auth.uid(),
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'record_id', CASE 
          WHEN TG_OP = 'DELETE' THEN OLD.id::text
          ELSE NEW.id::text
        END,
        'timestamp', now()
      )
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Add audit triggers to sensitive tables

-- Audit access to user_purchases (financial data)
DROP TRIGGER IF EXISTS audit_user_purchases_access ON public.user_purchases;
CREATE TRIGGER audit_user_purchases_access
  AFTER INSERT OR UPDATE OR DELETE ON public.user_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_sensitive_access();

-- Audit access to printify_orders (order data with addresses)
DROP TRIGGER IF EXISTS audit_printify_orders_access ON public.printify_orders;
CREATE TRIGGER audit_printify_orders_access
  AFTER INSERT OR UPDATE OR DELETE ON public.printify_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_sensitive_access();

-- Audit access to digital_downloads (purchase records)
DROP TRIGGER IF EXISTS audit_digital_downloads_access ON public.digital_downloads;
CREATE TRIGGER audit_digital_downloads_access
  AFTER INSERT OR UPDATE OR DELETE ON public.digital_downloads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_sensitive_access();

-- Audit access to user_roles (privilege changes)
DROP TRIGGER IF EXISTS audit_user_roles_access ON public.user_roles;
CREATE TRIGGER audit_user_roles_access
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_sensitive_access();

-- Audit access to grandfathered_emails (special access grants)
DROP TRIGGER IF EXISTS audit_grandfathered_emails_access ON public.grandfathered_emails;
CREATE TRIGGER audit_grandfathered_emails_access
  AFTER INSERT OR UPDATE OR DELETE ON public.grandfathered_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_sensitive_access();