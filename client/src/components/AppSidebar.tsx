import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
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
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = {
  super_admin: [
    { title: 'Dashboard', url: '/super-admin/dashboard', icon: LayoutDashboard },
    { title: 'Manage Admins', url: '/super-admin/admins', icon: Users },
    { title: 'Pricing Plans', url: '/super-admin/pricing', icon: DollarSign },
    { title: 'System Analytics', url: '/super-admin/analytics', icon: BarChart3 },
  ],
  admin: [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Products', url: '/admin/products', icon: Package },
    { title: 'Categories', url: '/admin/categories', icon: FolderTree },
    { title: 'Sales Report', url: '/admin/sales', icon: FileText },
    { title: 'Manage Staff', url: '/admin/staff', icon: UserPlus },
    { title: 'Subscription', url: '/admin/subscription', icon: CreditCard },
    { title: 'POS Access', url: '/pos', icon: ShoppingCart },
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

  if (!user) return null;

  const items = menuItems[user.role as keyof typeof menuItems] || [];
  
  const roleIcon = user.role === 'super_admin' ? Crown : user.role === 'admin' ? Store : Receipt;
  const RoleIcon = roleIcon;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-base">
            <RoleIcon className="w-4 h-4" />
            {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? user.shopName || 'Shop Owner' : 'Sales Person'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location === item.url || location.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 border-t">
          <div className="text-sm font-medium mb-1">{user.username}</div>
          <div className="text-xs text-muted-foreground mb-3">{user.email}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
