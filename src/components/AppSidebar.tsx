import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
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
  FolderTree,
  FileText,
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

type SubMenuItem = {
  title: string;
  url: string;
};

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  subMenu?: SubMenuItem[];
};

const menuItems: Record<string, MenuItem[]> = {
  super_admin: [
    { title: 'Dashboard', url: '/super-admin/dashboard', icon: LayoutDashboard },
    { title: 'Manage Admins', url: '/super-admin/admins', icon: Users },
    { title: 'Pricing Plans', url: '/super-admin/pricing', icon: DollarSign },
    { title: 'System Analytics', url: '/super-admin/analytics', icon: BarChart3 },
  ],
  admin: [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Clients', url: '/admin/clients', icon: Users },
    { title: 'Providers', url: '/admin/providers', icon: UserCheck },
    {
      title: 'Products',
      url: '/admin/products',
      icon: Package,
      subMenu: [
        { title: 'Products (IMEI/Serials)', url: '/admin/products/imei-serials' },
        { title: 'Generic Products', url: '/admin/products/generic' },
      ],
    },
    { title: 'Repair Book', url: '/admin/repair-book', icon: Book },
    { title: 'Close Today Turn', url: '/admin/close-today-turn', icon: Clock },
    { title: 'Private Wallet', url: '/admin/private-wallet', icon: CreditCard },
    { title: 'Recharge Payments', url: '/admin/recharge-payments', icon: DollarSign },
    { title: 'Activity Logs', url: '/admin/activity-logs', icon: List },
    { title: 'Drawer Open History', url: '/admin/drawer-history', icon: Archive },
    {
      title: 'Reports',
      url: '/admin/reports',
      icon: BarChart3,
      subMenu: [
        { title: 'Sales Reports', url: '/admin/reports/sales' },
        { title: 'Available Stock', url: '/admin/reports/available-stock' },
        { title: 'Stock Sold', url: '/admin/reports/stock-sold' },
        { title: 'Generic Product Reports', url: '/admin/reports/generic-products' },
        { title: 'Invoices', url: '/admin/reports/invoices' },
        { title: 'Contracts', url: '/admin/reports/contracts' },
        { title: 'Top Mobile Sales', url: '/admin/reports/top-mobile-sales' },
        { title: 'Mobile Record', url: '/admin/reports/mobile-record' },
        { title: 'Mobile Low Stock', url: '/admin/reports/mobile-low-stock' },
        { title: 'Generic Low Stock', url: '/admin/reports/generic-low-stock' },
        { title: 'Net Profit', url: '/admin/reports/net-profit' },
        { title: 'Sale Return', url: '/admin/reports/sale-return' },
      ],
    },
    { title: 'Sale Managers', url: '/admin/sale-managers', icon: UserPlus },
    { title: 'Coupon Codes', url: '/admin/coupons', icon: Tag },
  ],
  sales_person: [
    { title: 'POS Dashboard', url: '/pos', icon: ShoppingCart },
    { title: 'Recent Sales', url: '/pos/sales', icon: Clock },
    { title: 'Products', url: '/pos/products', icon: Package },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const [location] = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const toggleSubMenu = (title: string) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  if (!user) return null;

  const items = menuItems[user.role as keyof typeof menuItems] || [];

  const roleConfig = {
    super_admin: { icon: Crown, name: 'Super Admin', gradient: 'from-purple-600 to-indigo-600' },
    admin: { icon: Store, name: user.shopName || 'Shop Owner', gradient: 'from-indigo-600 to-blue-600' },
    sales_person: { icon: Zap, name: 'Sales Person', gradient: 'from-teal-500 to-emerald-500' }
  };

  const config = roleConfig[user.role as keyof typeof roleConfig];
  const RoleIcon = config.icon;

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
                const hasSubMenu = 'subMenu' in item && !!item.subMenu;
                const isSubMenuOpen = openSubMenu === item.title;
                return (
                  <SidebarMenuItem key={item.title}>
                    <div
                      onClick={() => hasSubMenu ? toggleSubMenu(item.title) : null}
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
                        <span className="font-medium">{item.title}</span>
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

                    {/* Submenu Section */}
                    {hasSubMenu && (
                      <div
                        className={`ml-8 mt-1 overflow-hidden transition-all duration-300 ${isSubMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        {item.subMenu?.map((sub) => {
                          const isSubActive = location === sub.url;
                          return (
                            <Link
                              key={sub.title}
                              href={sub.url}
                              className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isSubActive
                                  ? 'bg-sidebar-primary/20 text-sidebar-primary-foreground'
                                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                }
                `}
                            >
                              
                              <span>{sub.title}</span>
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
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
