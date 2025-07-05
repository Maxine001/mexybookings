ALTER TABLE bookings
ADD COLUMN reference VARCHAR(255) UNIQUE NOT NULL DEFAULT gen_random_uuid();
