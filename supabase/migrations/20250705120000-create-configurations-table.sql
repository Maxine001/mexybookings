-- Create configurations table to store key-value pairs for app configuration
CREATE TABLE public.configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on configurations table
ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all configurations
CREATE POLICY "Admins can view all configurations"
  ON public.configurations FOR SELECT
  USING (public.is_admin_user());

-- Create policy for admins to insert configurations
CREATE POLICY "Admins can insert configurations"
  ON public.configurations FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Create policy for admins to update configurations
CREATE POLICY "Admins can update configurations"
  ON public.configurations FOR UPDATE
  USING (public.is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_configurations_key ON public.configurations(key);
