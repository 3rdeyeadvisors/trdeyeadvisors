-- Grant courses 3 and 4 to all existing users who don't have them
INSERT INTO public.user_purchases (user_id, product_id, amount_paid)
SELECT u.id, course_id, 0
FROM auth.users u
CROSS JOIN (SELECT unnest(ARRAY[3, 4]) AS course_id) courses
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_purchases up 
  WHERE up.user_id = u.id AND up.product_id = courses.course_id
)
ON CONFLICT DO NOTHING;