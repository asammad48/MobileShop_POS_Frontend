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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={`$${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          gradient="from-teal-500 to-emerald-600"
        />
        <StatCard
          title="Wallet Balance"
          value={`$${stats.walletBalance.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: 8.2, isPositive: true }}
          gradient="from-blue-600 to-indigo-600"
        />
        <StatCard
          title="Total Stock Available"
          value={stats.totalStock}
          icon={Package}
          trend={{ value: 15.3, isPositive: true }}
          gradient="from-purple-600 to-pink-600"
        />
        <StatCard
          title="Clients Credit"
          value={`$${stats.clientsCredit.toLocaleString()}`}
          icon={CreditCard}
          gradient="from-amber-500 to-orange-600"
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
