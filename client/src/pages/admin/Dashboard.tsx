import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/StatCard';
import SalesAnalyticsChart from '@/components/SalesAnalyticsChart';
import DevicesInRepair from '@/components/DevicesInRepair';
import LastSales from '@/components/LastSales';
import LowStockAlert from '@/components/LowStockAlert';
import { DollarSign, Wallet, Package, CreditCard } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  useAuth('admin');
  const [, setLocation] = useLocation();

  //todo: remove mock functionality
  const stats = {
    todaySales: 1250.50,
    walletBalance: 8750.25,
    totalStock: 1256,
    clientsCredit: 3420.00,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Shop Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your shop performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value={`$${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-4 to-chart-3"
        />
        <StatCard
          title="Wallet Balance"
          value={`$${stats.walletBalance.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: 8.2, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-3 to-primary"
        />
        <StatCard
          title="Total Stock Available"
          value={stats.totalStock}
          icon={Package}
          trend={{ value: 15.3, isPositive: true }}
          gradient="bg-gradient-to-br from-primary to-chart-2"
        />
        <StatCard
          title="Clients Credit"
          value={`$${stats.clientsCredit.toLocaleString()}`}
          icon={CreditCard}
          gradient="bg-gradient-to-br from-chart-2 to-chart-1"
        />
      </div>

      <SalesAnalyticsChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DevicesInRepair />
        <div className="space-y-6">
          <LastSales onViewAll={() => setLocation('/admin/sales')} />
        </div>
      </div>

      <LowStockAlert />
    </div>
  );
}
