-- Fix Kevin's email address from .co to .com
UPDATE public.subscribers
SET email = 'kevinguerrier.kg@gmail.com'
WHERE email = 'kevinguerrier.kg@gmail.co';