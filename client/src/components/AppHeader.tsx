import { Bell, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function AppHeader() {
  const { user } = useAuthStore();

  const roleTitle = {
    super_admin: 'System Administration',
    admin: 'Business Dashboard',
    sales_person: 'Point of Sale'
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-lg shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger data-testid="button-sidebar-toggle" className="hover-elevate" />
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">{user ? roleTitle[user.role as keyof typeof roleTitle] : 'Dashboard'}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-10 w-72 h-9 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="input-search"
            />
          </div>

          <Button 
            size="icon" 
            variant="ghost" 
            className="h-9 w-9 rounded-xl relative hover-elevate"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
              3
            </Badge>
          </Button>

          <Button 
            size="icon" 
            variant="ghost" 
            className="h-9 w-9 rounded-xl hover-elevate"
            data-testid="button-refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 rounded-xl hover-elevate"
                data-testid="button-language"
              >
                <span className="text-lg mr-2">🇺🇸</span>
                <span className="hidden sm:inline text-sm font-medium">EN</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  className="rounded-lg cursor-pointer"
                  data-testid={`menu-item-${lang.code}`}
                >
                  <span className="text-lg mr-3">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l">
            <div className="text-right">
              <div className="text-sm font-medium">Hi, {user?.username}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
