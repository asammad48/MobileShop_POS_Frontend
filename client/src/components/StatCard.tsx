import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, gradient }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className={`p-5 ${gradient || 'bg-gradient-to-br from-primary to-chart-2'}`}>
        <div className="flex items-center justify-between text-primary-foreground">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </Card>
  );
}
