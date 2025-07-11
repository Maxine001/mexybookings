-- Create payments table to store Paystack payment records
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  channel TEXT,
  gateway_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- First, update all existing booking dates
UPDATE bookings
SET booking_date = booking_date + INTERVAL '1 day';

-- Create a function to handle the trigger
CREATE OR REPLACE FUNCTION adjust_booking_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Add 1 day to the booking_date
    NEW.booking_date = NEW.booking_date + INTERVAL '1 day';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

-- Create a trigger to automatically adjust booking dates for new records
DROP TRIGGER IF EXISTS adjust_booking_date_trigger ON bookings;

CREATE TRIGGER adjust_booking_date_trigger
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION adjust_booking_date();

-- Create policy for admins to view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin_user());

-- Create policy for admins to insert payments
CREATE POLICY "Admins can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Create policy for admins to update payments
CREATE POLICY "Admins can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_payments_reference ON public.payments(reference);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);
