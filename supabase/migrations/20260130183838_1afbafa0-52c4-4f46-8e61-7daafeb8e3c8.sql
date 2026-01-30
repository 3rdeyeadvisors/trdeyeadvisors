-- Create feature_suggestions table for premium member idea submissions
CREATE TABLE public.feature_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  description text NOT NULL CHECK (char_length(description) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'promoted')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_suggestions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view suggestions
CREATE POLICY "Authenticated users can view suggestions"
  ON public.feature_suggestions FOR SELECT
  TO authenticated USING (true);

-- Authenticated users can insert their own suggestions (premium check in app layer)
CREATE POLICY "Users can insert their own suggestions"
  ON public.feature_suggestions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admins can update suggestions (for status changes, notes)
CREATE POLICY "Admins can update suggestions"
  ON public.feature_suggestions FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_feature_suggestions_updated_at
  BEFORE UPDATE ON public.feature_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_feature_suggestions_status ON public.feature_suggestions(status);
CREATE INDEX idx_feature_suggestions_user_id ON public.feature_suggestions(user_id);
CREATE INDEX idx_feature_suggestions_created_at ON public.feature_suggestions(created_at DESC);