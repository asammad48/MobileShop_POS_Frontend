import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        rounded-xl px-4 py-3 transition-all duration-200
                        ${isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30' 
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
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
