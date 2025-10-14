import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export function useAuth(requiredRole?: string) {
  const { isAuthenticated, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'super_admin') {
        setLocation('/super-admin/dashboard');
      } else if (user?.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (user?.role === 'sales_person') {
        setLocation('/pos');
      }
    }
  }, [isAuthenticated, user, requiredRole, setLocation]);

  return { isAuthenticated, user };
}
