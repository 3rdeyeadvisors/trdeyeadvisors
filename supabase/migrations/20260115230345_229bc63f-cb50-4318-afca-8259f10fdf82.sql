-- Repopulate bot_config with correct user_ids and valid personality types
INSERT INTO public.bot_config (user_id, personality_type, max_point_percentage)
SELECT 
  p.user_id,
  CASE 
    WHEN p.display_name LIKE '%Chen%' OR p.display_name LIKE '%Rodriguez%' OR p.display_name LIKE '%Nakamura%' THEN 'aggressive'
    WHEN p.display_name LIKE '%Patel%' OR p.display_name LIKE '%Thompson%' OR p.display_name LIKE '%Kim%' THEN 'steady'
    WHEN p.display_name LIKE '%Anderson%' OR p.display_name LIKE '%Santos%' OR p.display_name LIKE '%Mueller%' THEN 'casual'
    WHEN p.display_name LIKE '%Liu%' OR p.display_name LIKE '%Okonkwo%' OR p.display_name LIKE '%Dubois%' THEN 'aggressive'
    WHEN p.display_name LIKE '%Johansson%' OR p.display_name LIKE '%Petrov%' OR p.display_name LIKE '%Fernandez%' THEN 'steady'
    WHEN p.display_name LIKE '%Harrison%' OR p.display_name LIKE '%Takahashi%' OR p.display_name LIKE '%Gupta%' THEN 'low_activity'
    ELSE 'steady'
  END as personality_type,
  CASE 
    WHEN p.display_name LIKE '%Chen%' OR p.display_name LIKE '%Rodriguez%' OR p.display_name LIKE '%Nakamura%' THEN 85
    WHEN p.display_name LIKE '%Patel%' OR p.display_name LIKE '%Thompson%' OR p.display_name LIKE '%Kim%' THEN 70
    WHEN p.display_name LIKE '%Anderson%' OR p.display_name LIKE '%Santos%' OR p.display_name LIKE '%Mueller%' THEN 50
    WHEN p.display_name LIKE '%Liu%' OR p.display_name LIKE '%Okonkwo%' OR p.display_name LIKE '%Dubois%' THEN 80
    WHEN p.display_name LIKE '%Johansson%' OR p.display_name LIKE '%Petrov%' OR p.display_name LIKE '%Fernandez%' THEN 65
    WHEN p.display_name LIKE '%Harrison%' OR p.display_name LIKE '%Takahashi%' OR p.display_name LIKE '%Gupta%' THEN 45
    ELSE 60
  END as max_point_percentage
FROM public.profiles p
WHERE p.is_bot = true
ON CONFLICT (user_id) DO UPDATE SET
  personality_type = EXCLUDED.personality_type,
  max_point_percentage = EXCLUDED.max_point_percentage,
  updated_at = now();