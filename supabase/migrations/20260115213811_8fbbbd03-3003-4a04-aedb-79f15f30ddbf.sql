-- Update the spots remaining function to account for 13 legacy founding members
CREATE OR REPLACE FUNCTION get_founding33_spots_remaining()
RETURNS INTEGER AS $$
DECLARE
  legacy_founders INTEGER := 13;  -- Pre-existing founding members before automated system
  new_purchases INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO new_purchases
  FROM public.founding33_purchases
  WHERE status = 'completed';
  
  RETURN GREATEST(0, 33 - legacy_founders - new_purchases);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Upgrade all grandfathered members to founding_33 access type
UPDATE public.grandfathered_emails 
SET access_type = 'founding_33'
WHERE access_type = 'full_platform';