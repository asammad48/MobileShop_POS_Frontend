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
    <Card className="overflow-hidden">
      <div className={`p-4 ${gradient || 'bg-gradient-to-br from-primary to-chart-2'}`}>
        <div className="flex items-center justify-between text-primary-foreground">
          <Icon className="w-6 h-6" />
          {trend && (
            <span className="text-xs font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{title}</div>
      </div>
    </Card>
  );
}
