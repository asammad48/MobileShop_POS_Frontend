import StatCard from '../StatCard';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatCard 
        title="Total Revenue" 
        value="$12,450" 
        icon={DollarSign}
        trend={{ value: 12.5, isPositive: true }}
        gradient="bg-gradient-to-br from-primary to-chart-2"
      />
      <StatCard 
        title="Total Users" 
        value="1,234" 
        icon={Users}
        trend={{ value: 8.2, isPositive: true }}
        gradient="bg-gradient-to-br from-chart-3 to-primary"
      />
      <StatCard 
        title="Total Sales" 
        value="342" 
        icon={ShoppingCart}
        trend={{ value: -3.1, isPositive: false }}
        gradient="bg-gradient-to-br from-chart-4 to-chart-3"
      />
      <StatCard 
        title="Growth Rate" 
        value="24%" 
        icon={TrendingUp}
        trend={{ value: 15.3, isPositive: true }}
        gradient="bg-gradient-to-br from-chart-2 to-chart-1"
      />
    </div>
  );
}
