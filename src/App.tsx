import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useAuthStore } from "@/store/authStore";
import NotFound from "@/pages/not-found";

import Login from "@/pages/auth/Login";

import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import ManageAdmins from "@/pages/superadmin/Admins";
import PricingPlans from "@/pages/superadmin/Pricing";
import SystemAnalytics from "@/pages/superadmin/Analytics";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/AdminClients";
import Providers from "./pages/admin/Providers";
import GenericProducts from "./pages/admin/Generic";
import Products from "@/pages/admin/Products";
import Categories from "@/pages/admin/Categories";
import SalesReport from "@/pages/admin/Sales";
import ManageStaff from "@/pages/admin/Staff";
import Subscription from "@/pages/admin/Subscription";

import POS from "@/pages/pos/POS";
import RecentSales from "@/pages/pos/Sales";
import POSProducts from "@/pages/pos/Products";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const style = {
    "--sidebar-width": "17.5rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background rtl:flex-row-reverse">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {!isAuthenticated && (
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      )}
      {/* Super admin routes */}
      <Route path="/super-admin/dashboard">
        <ProtectedLayout><SuperAdminDashboard /></ProtectedLayout>
      </Route>
      <Route path="/super-admin/admins">
        <ProtectedLayout><ManageAdmins /></ProtectedLayout>
      </Route>
      <Route path="/super-admin/pricing">
        <ProtectedLayout><PricingPlans /></ProtectedLayout>
      </Route>
      <Route path="/super-admin/analytics">
        <ProtectedLayout><SystemAnalytics /></ProtectedLayout>
      </Route>

      {/* Admin routes */}
      <Route path="/admin/dashboard">
        <ProtectedLayout><AdminDashboard /></ProtectedLayout>
      </Route>
      <Route path="/admin/clients">
        <ProtectedLayout><AdminClients /></ProtectedLayout>
      </Route>
      <Route path="/admin/providers">
        <ProtectedLayout><Providers /></ProtectedLayout>
      </Route>
      <Route path="/admin/products">
        <ProtectedLayout><Products /></ProtectedLayout>
      </Route>
      <Route path="/admin/products/generic">
        <ProtectedLayout><GenericProducts /></ProtectedLayout>
      </Route>
      <Route path="/admin/categories">
        <ProtectedLayout><Categories /></ProtectedLayout>
      </Route>
      <Route path="/admin/sales">
        <ProtectedLayout><SalesReport /></ProtectedLayout>
      </Route>
      <Route path="/admin/staff">
        <ProtectedLayout><ManageStaff /></ProtectedLayout>
      </Route>
      <Route path="/admin/subscription">
        <ProtectedLayout><Subscription /></ProtectedLayout>
      </Route>

      <Route path="/pos">
        <ProtectedLayout><POS /></ProtectedLayout>
      </Route>
      <Route path="/pos/sales">
        <ProtectedLayout><RecentSales /></ProtectedLayout>
      </Route>
      <Route path="/pos/products">
        <ProtectedLayout><POSProducts /></ProtectedLayout>
      </Route>

      <Route path="/">
        <Redirect to="/login" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
