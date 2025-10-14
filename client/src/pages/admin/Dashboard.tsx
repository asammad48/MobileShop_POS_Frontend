import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/StatCard';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  useAuth('admin');

  //todo: remove mock functionality
  const stats = {
    todaySales: 1250.50,
    totalProducts: 156,
    totalSales: 89,
    activeStaff: 3,
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
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: 8.2, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-3 to-primary"
        />
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={ShoppingCart}
          trend={{ value: 15.3, isPositive: true }}
          gradient="bg-gradient-to-br from-primary to-chart-2"
        />
        <StatCard
          title="Active Staff"
          value={stats.activeStaff}
          icon={Users}
          gradient="bg-gradient-to-br from-chart-2 to-chart-1"
        />
      </div>
    </div>
  );
}
