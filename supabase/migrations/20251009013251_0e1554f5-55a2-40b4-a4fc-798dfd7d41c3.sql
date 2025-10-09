-- Clean up subscribers table - keep only Kevin and Demond
DELETE FROM public.subscribers
WHERE email NOT IN ('kevinguerrier.kg@gmail.com', 'demond.hall98@gmail.com');