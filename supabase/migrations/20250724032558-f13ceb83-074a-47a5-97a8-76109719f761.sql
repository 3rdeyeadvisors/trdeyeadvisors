-- Fix duplicate index issue by properly handling the constraint
-- Drop the old constraint and recreate with the better name

-- Drop the old constraint (this will also drop its associated index)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Ensure we have the properly named unique constraint
-- (This may already exist from our previous migration)
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

-- The unique constraint automatically creates an index, so we don't need a separate index
-- Remove any redundant standalone index if it exists
DROP INDEX IF EXISTS public.idx_profiles_user_id;