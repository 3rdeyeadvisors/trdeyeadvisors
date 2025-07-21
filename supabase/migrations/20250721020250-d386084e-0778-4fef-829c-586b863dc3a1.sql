-- Deactivate specific products that match the requested removal items
UPDATE printify_products 
SET is_active = false, updated_at = now()
WHERE 
  LOWER(title) LIKE '%cosmic%hoodie%' OR 
  LOWER(title) LIKE '%hoodie%cosmic%' OR
  LOWER(title) LIKE '%sticker%pack%' OR
  LOWER(title) LIKE '%pack%sticker%' OR
  LOWER(title) LIKE '%system%shirt%' OR
  LOWER(title) LIKE '%shirt%system%';