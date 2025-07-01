
-- Create transfers table to store all transfer records
CREATE TABLE public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'processing')),
  reference TEXT UNIQUE NOT NULL,
  transfer_code TEXT,
  paystack_recipient_code TEXT,
  initiated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  failure_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create transfer_recipients table to store verified recipients
CREATE TABLE public.transfer_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_recipients ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- RLS Policies for transfers table
CREATE POLICY "Admins can view all transfers"
  ON public.transfers FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert transfers" 
  ON public.transfers FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update transfers"
  ON public.transfers FOR UPDATE
  USING (public.is_admin_user());

-- RLS Policies for transfer_recipients table  
CREATE POLICY "Admins can view all recipients"
  ON public.transfer_recipients FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert recipients"
  ON public.transfer_recipients FOR INSERT 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update recipients"
  ON public.transfer_recipients FOR UPDATE
  USING (public.is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_transfers_status ON public.transfers(status);
CREATE INDEX idx_transfers_created_at ON public.transfers(created_at DESC);
CREATE INDEX idx_transfers_reference ON public.transfers(reference);
CREATE INDEX idx_recipients_code ON public.transfer_recipients(recipient_code);
