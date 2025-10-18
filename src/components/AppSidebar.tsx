import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart3,
  Package,
  UserPlus,
  CreditCard,
  ShoppingCart,
  Clock,
  LogOut,
  Crown,
  Store,
  Zap,
  UserCheck,
  Book,
  List,
  Archive,
  Tag,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

type SubMenuItem = {
  key: string;
  url: string;
};

type MenuItem = {
  key: string;
  url: string;
  icon: React.ElementType;
  subMenu?: SubMenuItem[];
};

const menuItems: Record<string, MenuItem[]> = {
  super_admin: [
    { key: 'Dashboard', url: '/super-admin/dashboard', icon: LayoutDashboard },
    { key: 'Manage Admins', url: '/super-admin/admins', icon: Users },
    { key: 'Pricing Plans', url: '/super-admin/pricing', icon: DollarSign },
    { key: 'System Analytics', url: '/super-admin/analytics', icon: BarChart3 },
  ],
  admin: [
    { key: 'dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    { key: 'clients', url: '/admin/clients', icon: Users },
    { key: 'providers', url: '/admin/providers', icon: UserCheck },
    {
      key: 'products',
      url: '/admin/products',
      icon: Package,
      subMenu: [
        { key: 'generic', url: '/admin/products/generic' },
      ],
    },
    { key: 'repair_book', url: '/admin/repair-book', icon: Book },
    { key: 'close_today_turn', url: '/admin/close-today-turn', icon: Clock },
    { key: 'private_wallet', url: '/admin/private-wallet', icon: CreditCard },
    { key: 'recharge_payments', url: '/admin/recharge-payments', icon: DollarSign },
    { key: 'activity_logs', url: '/admin/activity-logs', icon: List },
    { key: 'drawer_history', url: '/admin/drawer-history', icon: Archive },
    {
      key: 'reports',
      url: '/admin/reports',
      icon: BarChart3,
      subMenu: [
        { key: 'sales', url: '/admin/reports/sales' },
        { key: 'available_stock', url: '/admin/reports/available-stock' },
        { key: 'stock_sold', url: '/admin/reports/stock-sold' },
        { key: 'generic_products', url: '/admin/reports/generic-products' },
        { key: 'invoices', url: '/admin/reports/invoices' },
        { key: 'contracts', url: '/admin/reports/contracts' },
        { key: 'top_mobile_sales', url: '/admin/reports/top-mobile-sales' },
        { key: 'mobile_record', url: '/admin/reports/mobile-record' },
        { key: 'mobile_low_stock', url: '/admin/reports/mobile-low-stock' },
        { key: 'generic_low_stock', url: '/admin/reports/generic-low-stock' },
        { key: 'net_profit', url: '/admin/reports/net-profit' },
        { key: 'sale_return', url: '/admin/reports/sale-return' },
      ],
    },
    { key: 'sale_managers', url: '/admin/sale-managers', icon: UserPlus },
    { key: 'coupons', url: '/admin/coupons', icon: Tag },
  ],
  sales_person: [
    { key: 'POS Dashboard', url: '/pos', icon: ShoppingCart },
    { key: 'Recent Sales', url: '/pos/sales', icon: Clock },
    { key: 'Products', url: '/pos/products', icon: Package },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const [location] = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { t } = useTranslation();

  if (!user) return null;

  const items = menuItems[user.role as keyof typeof menuItems] || [];

  const roleConfig = {
    super_admin: { icon: Crown, name: 'Super Admin', gradient: 'from-purple-600 to-indigo-600' },
    admin: { icon: Store, name: user.shopName || 'Shop Owner', gradient: 'from-indigo-600 to-blue-600' },
    sales_person: { icon: Zap, name: 'Sales Person', gradient: 'from-teal-500 to-emerald-500' },
  };

  const config = roleConfig[user.role as keyof typeof roleConfig];
  const RoleIcon = config.icon;

  const toggleSubMenu = (key: string) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">POS System</h2>
            <p className="text-xs text-sidebar-foreground/70">{config.name}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location === item.url || location.startsWith(item.url + '/');
                const hasSubMenu = !!item.subMenu;
                const isSubMenuOpen = openSubMenu === item.key;

                return (
                  <SidebarMenuItem key={item.key}>
                    <div
                      onClick={() => (hasSubMenu ? toggleSubMenu(item.key) : null)}
                      className={`
                        flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all duration-200
                        ${isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-2 flex-1">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">
                          {user.role === 'admin'
                            ? hasSubMenu
                              ? t(`admin.sidebar.${item.key}.title`)
                              : t(`admin.sidebar.${item.key}`)
                            : item.key}
                        </span>
                      </Link>
                      {hasSubMenu && (
                        <span className="ml-2">
                          {isSubMenuOpen ? (
                            <ChevronDown className="w-4 h-4 opacity-70" />
                          ) : (
                            <ChevronRight className="w-4 h-4 opacity-70" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Submenu */}
                    {hasSubMenu && (
                      <div
                        className={`ml-8 mt-1 overflow-hidden transition-all duration-300 ${isSubMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        {item.subMenu?.map((sub) => {
                          const isSubActive = location === sub.url;
                          return (
                            <Link
                              key={sub.key}
                              href={sub.url}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                ${isSubActive
                                  ? 'bg-sidebar-primary/20 text-sidebar-primary-foreground'
                                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                }
                              `}
                            >
                              <span>
                                {user.role === 'admin'
                                  ? t(`admin.sidebar.${item.key}.sub.${sub.key}`)
                                  : sub.key}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary/30">
            <AvatarImage src="" />
            <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white font-semibold`}>
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-sidebar-foreground truncate">{user.username}</div>
            <div className="text-xs text-sidebar-foreground/70 truncate">{user.email}</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('admin.sidebar.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
