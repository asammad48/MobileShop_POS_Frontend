import AppHeader from '../AppHeader';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function AppHeaderExample() {
  const login = useAuthStore(state => state.login);
  
  useEffect(() => {
    login('admin', 'admin123');
  }, [login]);

  return (
    <div className="h-screen flex flex-col">
      <AppHeader onRefresh={() => console.log('Refreshed!')} />
      <div className="flex-1 p-6">
        <p className="text-muted-foreground">Page content goes here</p>
      </div>
    </div>
  );
}
