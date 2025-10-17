import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/StatCard';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function SystemAnalytics() {
  useAuth('super_admin');

  //todo: remove mock functionality
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">System Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$45,280"
          icon={DollarSign}
          trend={{ value: 18.2, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-4 to-chart-3"
        />
        <StatCard
          title="Active Shops"
          value="24"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-3 to-primary"
        />
        <StatCard
          title="Total Sales"
          value="1,543"
          icon={ShoppingCart}
          trend={{ value: 8.7, isPositive: true }}
          gradient="bg-gradient-to-br from-primary to-chart-2"
        />
        <StatCard
          title="Growth Rate"
          value="32%"
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: true }}
          gradient="bg-gradient-to-br from-chart-2 to-chart-1"
        />
      </div>
    </div>
  );
}
