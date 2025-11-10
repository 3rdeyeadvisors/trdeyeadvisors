-- Drop the restrictive policy and create a proper permissive one
DROP POLICY IF EXISTS "Raffles are viewable by everyone" ON raffles;

-- Create a permissive policy that allows everyone to view raffles
CREATE POLICY "Raffles are viewable by everyone" 
ON raffles 
FOR SELECT 
TO public
USING (true);