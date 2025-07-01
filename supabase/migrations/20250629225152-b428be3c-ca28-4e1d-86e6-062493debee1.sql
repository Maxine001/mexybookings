
-- Update the bookings table to include client_email and uploaded_images columns
-- and remove client_username since we're using client_email instead
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS client_email text,
ADD COLUMN IF NOT EXISTS uploaded_images jsonb;

-- Remove client_username column if it exists
ALTER TABLE public.bookings 
DROP COLUMN IF EXISTS client_username;

-- Make client_email required
ALTER TABLE public.bookings 
ALTER COLUMN client_email SET NOT NULL;
