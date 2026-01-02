-- Add early_access_date column to courses table
-- When set, only annual subscribers can access the course until the public release date
ALTER TABLE public.courses 
ADD COLUMN early_access_date timestamp with time zone DEFAULT NULL,
ADD COLUMN public_release_date timestamp with time zone DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.courses.early_access_date IS 'Date when annual subscribers can access this course';
COMMENT ON COLUMN public.courses.public_release_date IS 'Date when all subscribers can access this course';