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
          <SidebarGroupLabel className="flex items-center gap-2 text-base px-4 py-4">
            <RoleIcon className="w-5 h-5" />
            <span className="font-semibold">
              {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? user.shopName || 'Shop Owner' : 'Sales Person'}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location === item.url || location.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        rounded-lg px-3 py-2.5 transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'hover:bg-primary/10 hover:text-primary'
                        }
                      `}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
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
          <div className="mb-3 px-2">
            <div className="text-sm font-semibold mb-0.5">{user.username}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors" 
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
