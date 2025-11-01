import { Bell, Search } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { useTitle } from '@/context/TitleContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export default function AppHeader() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { title, setTitle } = useTitle(); // <-- read title


  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    document.dir = langCode === 'ar' || langCode === 'ur' ? 'rtl' : 'ltr';
  };

  const roleTitle = {
    super_admin: t('admin.titles.super_admin'),
    admin: t('admin.titles.admin'),
    sales_person: t('admin.titles.sales_person'),
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-lg shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger data-testid="button-sidebar-toggle" className="hover-elevate" />

          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">
              {/* {user ? roleTitle[user.role as keyof typeof roleTitle] : t('admin.header.dashboard_fallback')} */}
              {title}
            </h1>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* SEARCH FIELD */}
          <div className="relative hidden lg:block">
            <Search
              className="absolute inset-inline-start-3 top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={t('admin.header.search_placeholder')}
              className="ps-10 w-72 h-9 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="input-search"
            />
          </div>

          {/* NOTIFICATIONS */}
          <Button
            size="icon"
            variant="ghost"
            className="relative h-9 w-9 rounded-xl hover:bg-muted/50 transition flex items-center justify-center"
            data-testid="button-notifications"
            aria-label={t('admin.header.notifications')}
          >
            {/* Bell Icon (now absolute and centered) */}
            <Bell className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            {/* Notification Badge */}
            <Badge
              className="absolute -top-2 -right-2 flex items-center justify-center text-[10px] font-semibold bg-accent text-white rounded-full w-4 h-4 shadow-md"
            >
              12
            </Badge>
          </Button>



          {/* LANGUAGE SELECTOR */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center h-9 px-3 rounded-xl hover:bg-muted/50 transition"
                data-testid="button-language"
              >
                <span className="text-lg leading-none">{languages.find(l => l.code === i18n.language)?.flag}</span>
                <span className="absolute top-2 right-0 rtl:-right-2 ms-2 text-[8px] font-medium tracking-wide uppercase">{i18n.language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl"
            >
              {languages.map(lang => (
                <DropdownMenuItem
                  key={lang.code}
                  className="rounded-lg cursor-pointer flex items-center gap-2"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{t(`admin.header.languages.${lang.code}`)}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER INFO */}
          <div className="hidden md:flex items-center gap-2 ps-3 border-s">
            <div className="text-end">
              <div className="text-sm font-medium">
                {t('admin.header.hi')}, {user?.username}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {user?.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
