
-- First, let's see what users exist in the system to get your user ID
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
