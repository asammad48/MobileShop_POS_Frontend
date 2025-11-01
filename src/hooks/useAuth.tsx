import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export function useAuth(requiredRoles?: string | string[]) {
  const { isAuthenticated, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    // If requiredRoles is provided, check access
    if (requiredRoles) {
      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      const userRole = user?.role ?? '';

      // If user's role is not in the allowed list
      if (!rolesArray.includes(userRole)) {
        if (user?.role === 'super_admin') {
          setLocation('/super-admin/dashboard');
        } else if (user?.role === 'admin') {
          setLocation('/admin/dashboard');
        } else if (user?.role === 'sales_person') {
          setLocation('/pos');
        }
      }
    }
  }, [isAuthenticated, user, requiredRoles, setLocation]);

  return { isAuthenticated, user };
}
