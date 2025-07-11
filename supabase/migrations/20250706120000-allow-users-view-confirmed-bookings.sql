-- Add RLS policy to allow all authenticated users to view booking_date and booking_time of confirmed bookings

CREATE POLICY "Users can view confirmed bookings for booking slots"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    status = 'confirmed'
  );

-- Grant select on booking_date and booking_time columns to authenticated role
GRANT SELECT (booking_date, booking_time) ON public.bookings TO authenticated;
