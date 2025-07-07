
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          if (error instanceof Error && error.message.includes('Invalid refresh token')) {
            // Sign out user if refresh token is invalid
            await supabase.auth.signOut();
            setRole(null);
          } else {
            setRole('user'); // Default to user role
          }
        } else {
          if (Array.isArray(data) && data.length >= 1) {
            // Define role priority
            const rolePriority: Array<'admin' | 'user'> = ['admin', 'user'];
            // Extract roles from data
            const roles = data.map((item: { role: string }) => item.role as 'admin' | 'user');
            // Find highest priority role
            const highestRole: 'admin' | 'user' = rolePriority.find(r => roles.includes(r)) || 'user';
            if (data.length > 1) {
              console.info(`Multiple roles found for user, selecting highest priority role: ${highestRole}`);
            }
            setRole(highestRole);
          } else {
            setRole('user');
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading, isAdmin: role === 'admin' };
};
