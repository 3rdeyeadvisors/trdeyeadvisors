-- Allow admins to update all raffle tasks for verification
CREATE POLICY "Admins can update all raffle tasks"
ON public.raffle_tasks
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));