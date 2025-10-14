import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Bell, 
  RefreshCcw, 
  ChevronDown,
  Store
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

interface AppHeaderProps {
  onRefresh?: () => void;
}

export default function AppHeader({ onRefresh }: AppHeaderProps) {
  const { user } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleName = () => {
    if (user?.role === 'super_admin') return 'Super Admin Overview';
    if (user?.role === 'admin') return 'Administration Overview';
    if (user?.role === 'sales_person') return 'POS Overview';
    return 'Overview';
  };

  const handleRefresh = () => {
    console.log('Refresh triggered');
    if (onRefresh) onRefresh();
  };

  return (
    <header className="flex items-center gap-4 p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
          <Store className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold whitespace-nowrap" data-testid="text-role-name">
          {getRoleName()}
        </h2>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        <Button 
          size="icon" 
          variant="ghost"
          onClick={handleRefresh}
          data-testid="button-refresh"
        >
          <RefreshCcw className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <div className="text-sm">
            <div className="font-medium" data-testid="text-username">
              Hi, {user?.username}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="gap-2"
              data-testid="button-language"
            >
              <span className="text-xl">{selectedLanguage.flag}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setSelectedLanguage(lang)}
                className="gap-2"
                data-testid={`button-language-${lang.code}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
