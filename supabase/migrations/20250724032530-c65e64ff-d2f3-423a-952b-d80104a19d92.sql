-- Remove duplicate index on profiles table
-- Keep the more descriptive unique constraint name

-- Drop the less descriptive duplicate index
DROP INDEX IF EXISTS public.profiles_user_id_key;

-- Keep profiles_user_id_unique as it's more descriptive
-- This constraint provides both uniqueness and indexing functionality

-- Verify the essential unique constraint and index remain
-- (This should already exist from our previous migration)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
        AND constraint_name = 'profiles_user_id_unique'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Also ensure the basic index for lookups exists
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);