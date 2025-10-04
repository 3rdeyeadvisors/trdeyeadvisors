-- Update Decentralize Everything Tee with custom mockup images
UPDATE printify_products 
SET images = '[
  {"src": "/merchandise/decentralize-everything-white.png", "variant_ids": [71834, 71840, 71846, 71852, 71858], "position": "front", "is_default": true},
  {"src": "/merchandise/decentralize-everything-black.png", "variant_ids": [71829, 71835, 71841, 71847, 71853], "position": "front", "is_default": true}
]'::jsonb,
updated_at = now()
WHERE printify_id = '6844ba70f6f4da591706ef43';