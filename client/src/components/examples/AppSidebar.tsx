import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function AppSidebarExample() {
  const login = useAuthStore(state => state.login);
  
  useEffect(() => {
    login('admin', 'admin123');
  }, [login]);

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold">Main Content Area</h2>
          <p className="text-muted-foreground mt-2">This is where the page content would appear</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
